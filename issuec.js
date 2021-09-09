module.exports = function(RED) {
    function issueNode(config) {
        RED.nodes.createNode(this,config);
        let node = this;
        node.on('input', function(msg) {
            let global = node.context().global;
            msg.url = global.get("jira.url");
            msg.header = global.get("jira.headers");
            msg.url = msg.url.replace("{{api}}", "issue/");

            let notifyAndOverride = '?notifyUsers=false';
            if(
                msg.jiraId === undefined
                && msg.payload.fields !== undefined
            ){
                msg.method = 'POST';
                msg.url = msg.url + notifyAndOverride;
            } else if(
                msg.jiraId !== undefined
                && msg.payload.update !== undefined
            ){
                msg.method = 'PUT';
                msg.url = msg.url + msg.jiraId + notifyAndOverride;
            } else if(
                msg.jiraId !== undefined
                && msg.payload.update === undefined
            ){
                msg.method = 'GET';
                msg.url = msg.url + msg.jiraId;
            };
            
            msg.payload = msg.url;
            node.send(msg);
        });
    }
    RED.nodes.registerType("issuec", issueNode);
}
