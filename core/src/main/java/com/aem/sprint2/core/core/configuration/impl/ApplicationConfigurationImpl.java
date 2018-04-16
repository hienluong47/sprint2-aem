package com.aem.sprint2.core.core.configuration.impl;

import com.aem.sprint2.core.core.configuration.ApplicationConfiguration;
import org.apache.felix.scr.annotations.*;
import org.osgi.service.metatype.annotations.Designate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.osgi.service.component.annotations.Component;

@Component(service = ApplicationConfiguration.class,immediate = true)
@Designate(ocd = AppConfig.class)
public class ApplicationConfigurationImpl implements ApplicationConfiguration{

    private static final Logger LOG = LoggerFactory.getLogger(ApplicationConfigurationImpl.class);

    private String addressApi;
    private String homePath;

    @Activate
    @Modified
    private void activate(AppConfig appConfig){
        this.addressApi = appConfig.getAddressApi();
        this.homePath = appConfig.getHomePath();
        LOG.info("From osgi service: "+ this.addressApi);
    }

    @Override
    public String getAddressApi() {
        return addressApi;
    }

    @Override
    public String getHomePath() {
        return homePath;
    }
}
