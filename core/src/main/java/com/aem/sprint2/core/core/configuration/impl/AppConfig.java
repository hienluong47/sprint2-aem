package com.aem.sprint2.core.core.configuration.impl;

import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.AttributeType;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

@ObjectClassDefinition(name = "Sprint2AEM - Application Configuration", description = "This contains all application configuration")
public @interface AppConfig {
    @AttributeDefinition(name = "address.api",description = "Domain",type = AttributeType.STRING)
    String getAddressApi() default "http://localhost:3000/aia-ws";

    @AttributeDefinition(name = "home.path", description = "Home path to redirect", type = AttributeType.STRING)
    String getHomePath() default "/content/aia-sg-stp/loginsso.html";
}
