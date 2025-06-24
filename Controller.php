<?php

/**
 * Core Framework - LeadsController
 *
 * @license    MIT (https://mit-license.org/)
 * @author     Louis Ouellet <louis@laswitchtech.com>
 */

// Import additionnal class into the global namespace
use \LaswitchTech\Core\Objects;
use \LaswitchTech\Core\Abstracts\Controller;

class LeadsController extends Controller {

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

        // Set Properties
        switch($namespace){
            case "/leads/logo":
                $this->Public = true;
                $this->Level = 0;
                break;
        }
    }

    /**
     * Fetch an Lead's Logo
     *
     * @return mixed
     */
    public function logoAction(): array
    {
        // Import Global Variables
        global $CONFIG;

        // Retrieve the parameters
        $id = $this->Request->getParams('GET', 'id') ?? null;
        $size = $this->Request->getParams('GET', 'size') ?? 128;

        // Retrieve the lead
        $lead = $this->Model->Leads->logo($id);

        // Check if user was retrieved
        if(isset($lead['vcard'])){

            // Check if the lead has an avatar
            if($lead['vcard']['avatar']['uuid']){

                // Retrieve the file content
                $lead['vcard']['avatar']['content'] = $this->Helper->Files->get($lead['vcard']['avatar']['path'] . DIRECTORY_SEPARATOR . $lead['vcard']['avatar']['uuid']);

                // Return the file
                return $lead['vcard']['avatar'];
            }

            // Check if the lead has a website
            if($lead['vcard']['website']){
                $content = $this->Helper->Favicon->content($lead['vcard']['website']);
                $logo = [
                    'type' => $this->Helper->Favicon->mimeType($content),
                    'content' => $content
                ];
                // Convert the logo to png format
                $logo = $this->Helper->Favicon->convert($logo, 'png', $size, $size);
                return $logo;
            }
        }

        // Create the default logo from the img folder
        $logo = [
            'type' => mime_content_type($CONFIG->root() . DIRECTORY_SEPARATOR . 'dist' . DIRECTORY_SEPARATOR . 'img' . DIRECTORY_SEPARATOR . 'logo.png'),
            'content' => file_get_contents($CONFIG->root() . DIRECTORY_SEPARATOR . 'dist' . DIRECTORY_SEPARATOR . 'img' . DIRECTORY_SEPARATOR . 'logo.png')
        ];

        // Return the default logo
        return $logo;
    }
}
