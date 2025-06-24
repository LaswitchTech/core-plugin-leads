<?php

/**
 * Core Framework - LeadsEndpoint
 *
 * @license    MIT (https://mit-license.org/)
 * @author     Louis Ouellet <louis@laswitchtech.com>
 */

// Import additionnal class into the global namespace
use \LaswitchTech\Core\Abstracts\Endpoint;

class LeadsEndpoint extends Endpoint {

    /**
     * Constructor
     */
    public function __construct()
    {

        // Call Parent Constructor
        parent::__construct();

        // Retrieve the namespace
        $namespace = $this->Request->getNamespace();

        // Set Global access
        $this->Public = false;

        // Set Level
        switch($namespace){
            case "/leads/index":
            case "/leads/assigned":
            case "/leads/signed":
            case "/leads/details":
                $this->Level = 1;
                break;
            case "/leads/create":
                $this->Level = 2;
                break;
            case "/leads/archive":
            case "/leads/recover":
                $this->Level = 4;
                break;
        }
    }

    /**
     * Retrieve Leads
     */
    public function indexAction(): array
    {
        return ["status" => 200, "message" => "OK", "data" => $this->Model->Leads->list($this->Auth->user()->organization()->id)];
    }

    /**
     * Retrieve Assigned Leads
     */
    public function assignedAction(): array
    {
        return ["status" => 200, "message" => "OK", "data" => $this->Model->Leads->assigned($this->Auth->user()->organization()->id, $this->Auth->user()->id)];
    }

    /**
     * Retrieve Signed Leads
     */
    public function signedAction(): array
    {
        return ["status" => 200, "message" => "OK", "data" => $this->Model->Leads->signed($this->Auth->user()->organization()->id, $this->Auth->user()->id)];
    }

    /**
     * Retrieve Lead's Details
     */
    public function detailsAction(): array
    {
        $message = ["status" => 200, "message" => "OK", "data" => []];
        $lead = $this->Model->Leads->get(intval($this->Request->getParams('GET','id')));
        if(empty($lead)){
            $message = ["status" => 404, "message" => "Not Found", "data" => "Could not find the requested lead."];
        } else {
            if($lead['organization']['id'] != $this->Auth->user()->organization()->id){
                $message = ["status" => 403, "message" => "Forbidden", "data" => "You are not allowed to access this lead."];
            }
            if(($lead['assignedTo']['id'] != $this->Auth->user()->id) && !$this->Auth->isAuthorized("AccountManager", 1)){
                $message = ["status" => 403, "message" => "Forbidden", "data" => "You are not allowed to access this lead."];
            }
        }
        if($message['status'] == 200){
            $lead['task'] = $this->Model->Tasks->fetch(intval($lead['task']['id']));
            $relationships = $this->Model->Relationship->get('leads', $lead['id']);
            foreach($this->Model->Relationship->get('vcards', $lead['vcard']['id']) as $table => $relations){
                foreach($relations as $id => $record){
                    $relationships[$table][$id] = $record;
                }
            }
            $message['data'] = [
                "record" => $lead,
                "relationships" => $relationships,
            ];
        }
        return $message;
    }

    /**
     * Create a Lead
     */
    public function createAction(): array
    {
        // Import Global Variables
        global $CSRF;

        // Set the default message
        $message = ["status" => 200, "message" => "OK", "data" => []];

        // Check the request method
        if($this->Request->getMethod() == "POST"){
            $message["data"]["CSRF"] = [
                "token" => $CSRF->token(),
                "key" => $CSRF->key()
            ];
        }

        // Check if the task is accessible
        if($message['status'] == 200){

            // Check the request method
            if($this->Request->getMethod() == "POST"){

                // Retrieve the parameters
                $parameters = $this->Request->getParams('REQUEST');

                // Set Required Fields
                $required = ['name','email','phone','locale'];

                // Set Optional Fields
                $optional = ['tollfree','mobile','fax','tags','dba','industries','businessNumber','taxExtension','importerExtension','website','address','city','country','state','zipcode'];

                // Sanitize the parameters
                if(!array_key_exists('locale',$parameters) || empty($parameters['locale'] || is_null($parameters['locale']))){
                    $parameters['locale'] = $this->Locale->current();
                }
                foreach($parameters as $key => $value){
                    if(empty($value)){
                        unset($parameters[$key]);
                    } else {
                        if(!in_array($key,['country','state','locale','email','website','zipcode','contacts','name','dba'])){
                            if(in_array($key,['tags','industries']) && !is_array($value)){
                                $value = json_decode($value, true);
                                $parameters[$key] = $value;
                            }
                            if(!is_array($value)){
                                $parameters[$key] = ucwords(strtolower($value));
                            } else {
                                foreach($value as $k => $v){
                                    $parameters[$key][$k] = ucwords(strtolower($v));
                                }
                            }
                        }
                    }
                }

                // Check if all required fields are set
                if(count(array_intersect_key(array_flip($required), $parameters)) == count($required)){

                    // Initialize the Events
                    $message['data']['events'] = [];

                    // Retrieve the lead process
                    $process = $this->Model->Process->get('Lead');
                    $parameters['process'] = $process['process'];

                    // Retrieve the user's username and organization
                    $parameters['owner'] = $this->Auth->user()->username;
                    $parameters['organization'] = $this->Auth->user()->organization()->id;

                    // Create a Lead
                    $lead = [
                        'owner' => $parameters['owner'],
                        'organization' => $parameters['organization'],
                    ];
                    $leadId = $this->Model->Leads->create($lead);

                    // Create a vCard
                    $vCard = [
                        'category' => 'Lead',
                        'name' => $parameters['name'],
                        'address' => $parameters['address'] ?? null,
                        'city' => $parameters['city'] ?? null,
                        'country' => $parameters['country'],
                        'state' => $parameters['state'],
                        'zipcode' => $parameters['zipcode'] ?? null,
                        'email' => $parameters['email'],
                        'phone' => $parameters['phone'],
                        'website' => $parameters['website'] ?? null,
                        'locale' => $parameters['locale'],
                        'owner' => $parameters['owner'],
                        'organization' => $parameters['organization'],
                    ];
                    foreach($optional as $key){
                        if(isset($parameters[$key]) && !empty($parameters[$key])){
                            $vCard[$key] = $parameters[$key];
                        } elseif(in_array($key,['taxExtension','importerExtension'])) {
                            $vCard[$key] = "0001";
                        }
                    }
                    $vCardId = $this->Model->Vcards->create($vCard);

                    // Create a Task
                    $task = [
                        'label' => 'Progress on <vcard>'.$vCardId.':'.$vCard['name'].'</vcard>',
                        'category' => 'Lead',
                        'progress' => 0,
                        'scale' => count($process['process']),
                        'color' => 'primary',
                        'link' => '/plugin/leads/details?id='.$leadId."&name=".urlencode($vCard['name']),
                        'owner' => $parameters['owner'],
                        'process' => $parameters['process'],
                        'isActive' => 0,
                        'targetTable' => 'leads',
                        'targetId' => $leadId,
                    ];
                    $taskId = $this->Model->Tasks->create($task);

                    // Update the Lead
                    $affectedRows = $this->Model->Leads->update($leadId, ['vcard' => $vCardId, 'task' => $taskId]);

                    // Create the related events
                    $message['data']['events'][] = $this->Model->Event->create($parameters['owner'], 'tasks', $taskId, 'Task', 'New Task Created for <vcard>'.$vCardId.':'.$vCard['name'].'</vcard> by <vcard>'.$this->Auth->user()->vcard['id'].':'.$this->Auth->user()->username.'</vcard>', '/plugin/tasks/index?id='.$taskId);
                    $message['data']['events'][] = $this->Model->Event->create($parameters['owner'], 'vcards', $vCardId, 'vCard', 'New vCard Created for <vcard>'.$vCardId.':'.$vCard['name'].'</vcard> by <vcard>'.$this->Auth->user()->vcard['id'].':'.$this->Auth->user()->username.'</vcard>', '/plugin/vcards/details?id='.$vCardId);
                    $message['data']['events'][] = $this->Model->Event->create($parameters['owner'], 'leads', $leadId, 'Lead', 'New Lead Created about <vcard>'.$vCardId.':'.$vCard['name'].'</vcard> by <vcard>'.$this->Auth->user()->vcard['id'].':'.$this->Auth->user()->username.'</vcard>', '/plugin/leads/details?id='.$leadId);

                    // Count the affected rows
                    $count = $affectedRows + ($vCardId > 0 ? 1 : 0) + ($taskId > 0 ? 1 : 0) + ($leadId > 0 ? 1 : 0);

                    // Check if tags is set
                    if(isset($parameters['tags'])){
                        foreach($parameters['tags'] as $key => $tag){
                            $this->Model->Tags->create($tag);
                        }
                    }

                    // Check if industries is set
                    if(isset($parameters['industries'])){
                        foreach($parameters['industries'] as $key => $industry){
                            $this->Model->Industries->create($industry);
                        }
                    }

                    // Check if the lead was created
                    if($count == 4){

                        // Retrieve the final lead
                        $message['data']['record'] = $this->Model->Leads->get($leadId);
                    } else {
                        $message['status'] = 500;
                        $message['message'] = "Internal Server Error";
                        $message['data']['error'] = "An error occurred while creating the lead.";
                    }
                } else {
                    $message['status'] = 400;
                    $message['message'] = "Bad Request";
                    $message['data']['error'] = "Some required fields are missing [";
                    foreach($required as $key){
                        if(!array_key_exists($key, $parameters)){
                            $message['data']['error'] .= $key.", ";
                        }
                    }
                    $message['data']['error'] = rtrim($message['data']['error'], ", ");
                    $message['data']['error'] .= "]";
                }
            } else {
                $message = ["status" => 405, "message" => "Method Not Allowed", "data" => "The method is not allowed for the requested URL."];
            }
        }

        return $message;
    }

    /**
     * Archive a Lead
     */
    public function archiveAction(): array
    {
        // Set the default message
        $message = ["status" => 200, "message" => "OK", "data" => []];

        // Retrieve the Lead
        $lead = $this->Model->Leads->get(intval($this->Request->getParams('GET','id')));

        // Check if the Lead is accessible
        if(empty($lead)){
            $message = ["status" => 404, "message" => "Not Found", "data" => "Could not find the requested lead."];
        } else {
            if($lead['organization']['id'] != $this->Auth->user()->organization()->id){
                $message = ["status" => 403, "message" => "Forbidden", "data" => "You are not allowed to access this lead."];
            }
            if(!$this->Auth->isAuthorized("AccountManager", 4)){
                $message = ["status" => 403, "message" => "Forbidden", "data" => "You are not allowed to archive this lead."];
            }
        }

        // Check if the Note is accessible
        if($message['status'] == 200){

            // Check the request method
            if($this->Request->getMethod() == "GET"){

                // Update the Lead
                $this->Model->Leads->update($lead['id'], ["isArchived" => 1]);

                // Update the Task
                $this->Model->Tasks->archive($lead['task']['id']);

                // Retrieve the Updated Lead
                $message["data"]["record"] = $this->Model->Leads->get($lead['id']);
            } else {
                $message = ["status" => 400, "message" => "Bad Request", "data" => "Invalid Request Method"];
            }
        }

        return $message;
    }

    /**
     * Recover a Lead
     */
    public function recoverAction(): array
    {
        // Set the default message
        $message = ["status" => 200, "message" => "OK", "data" => []];

        // Retrieve the Lead
        $lead = $this->Model->Leads->get(intval($this->Request->getParams('GET','id')));

        // Check if the Lead is accessible
        if(empty($lead)){
            $message = ["status" => 404, "message" => "Not Found", "data" => "Could not find the requested lead."];
        } else {
            if($lead['organization']['id'] != $this->Auth->user()->organization()->id){
                $message = ["status" => 403, "message" => "Forbidden", "data" => "You are not allowed to access this lead."];
            }
            if(!$this->Auth->isAuthorized("AccountManager", 4)){
                $message = ["status" => 403, "message" => "Forbidden", "data" => "You are not allowed to access this lead."];
            }
        }

        // Check if the Note is accessible
        if($message['status'] == 200){

            // Check the request method
            if($this->Request->getMethod() == "GET"){

                // Update the Lead
                $affectedRows = $this->Model->Leads->update($lead['id'], ["isArchived" => 0]);

                // Retrieve the Updated Lead
                $message["data"]["record"] = $this->Model->Leads->get($lead['id']);
            } else {
                $message = ["status" => 400, "message" => "Bad Request", "data" => "Invalid Request Method"];
            }
        }

        return $message;
    }
}
