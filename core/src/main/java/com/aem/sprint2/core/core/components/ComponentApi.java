package com.aem.sprint2.core.core.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.aem.sprint2.core.core.configuration.ApplicationConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ComponentApi extends WCMUsePojo{

    private static final Logger LOG = LoggerFactory.getLogger(ComponentApi.class);

    private String apiUrl = "";

    private String addressApi = "";

    @Override
    public void activate() throws Exception {
//        ConfigurationAdmin confAdmin = getSlingScriptHelper().getService(ConfigurationAdmin.class);
//        Configuration conf = confAdmin.getConfiguration("com.aem.sprint2.core.core.configuration.impl.ApplicationConfigurationImpl");
//        Dictionary<String, Object> props = conf.getProperties();
//        LOG.info("Properties: " + props.get("getAddressApi"));

        ApplicationConfiguration applicationConfiguration = getSlingScriptHelper().getService(ApplicationConfiguration.class);
        if(null == applicationConfiguration){
            throw new Exception("Not able to inject ApplicationConfiguration service");
        }
        addressApi = applicationConfiguration.getAddressApi();

        //addressApi = props.get("getAddressApi").toString();

        apiUrl = addressApi + get("apiUrl", String.class);
        LOG.info("api url: " + apiUrl);
    }

    public String getApiUrl() { return apiUrl; }
    public String getMessage() { return "TEST WCMUsePojo"; }
}
