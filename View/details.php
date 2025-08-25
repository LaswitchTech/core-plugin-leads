<article id="layout"></article>
<script>
    (function () {
        $(document).ready(function(){
            builder.Layout('lead',"#layout",{id: '<?= $this->Request->getParams('GET', 'id') ?>'});
        });
    })();
</script>
