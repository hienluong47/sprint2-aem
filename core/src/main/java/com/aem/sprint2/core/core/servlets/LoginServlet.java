package com.aem.sprint2.core.core.servlets;

import com.aem.sprint2.core.core.commons.Constants;
import com.aem.sprint2.core.core.configuration.ApplicationConfiguration;
import org.apache.felix.scr.annotations.Reference;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.HttpConstants;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.apache.sling.commons.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Servlet;
import javax.servlet.ServletException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@Component(service=Servlet.class,
        property={
                org.osgi.framework.Constants.SERVICE_DESCRIPTION + "=Login Servlet",
                "sling.servlet.methods=" + HttpConstants.METHOD_POST,
                "sling.servlet.paths="+ "/bin/sprint2-aem/login"
        })
public class LoginServlet extends SlingAllMethodsServlet{
    @Reference
    private ApplicationConfiguration applicationConfiguration;

    private static final Logger LOG = LoggerFactory.getLogger(LoginServlet.class);

    @Override
    protected void doPost(SlingHttpServletRequest request, SlingHttpServletResponse response) throws ServletException, IOException {
        //String homePath = applicationConfiguration.getHomePath();

        JSONObject jsonResponse = new JSONObject();

        LOG.info("POST Sling Servlet ------------ ");

        BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(request.getInputStream()));
        try {
            String resultApi = "";
            resultApi = bufferedReader.readLine();

            JSONObject resultObject = new JSONObject(resultApi);
            LOG.info("TEST ------------ " + resultObject);
            String statusCode = StringUtils.replaceEach(resultObject.getString(Constants.STATUS_CODE), new String[] {"\n", "\r"}, new String[] {"", ""});
            jsonResponse.put(Constants.STATUS_CODE, Constants.SUCCESS_CODE);
            jsonResponse.put("url", "/content/sprint2-aem/change-dividend-option.html");

            LOG.info("TEST ------------response " + jsonResponse.toString());

        } catch (Exception e){

        } finally {
            bufferedReader.close();
        }

        response.getWriter().write(jsonResponse.toString());
    }
}
