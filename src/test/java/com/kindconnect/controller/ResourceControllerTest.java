package com.kindconnect.controller;

import com.kindconnect.model.Resource;
import com.kindconnect.service.ResourceService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ResourceController.class)
class ResourceControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ResourceService resourceService;

    @Test
    void getResourcesByCategory_returnsJsonResponse() throws Exception {
        Resource resource = new Resource("Local Food Bank", "Food", "Offers groceries", "Newark, DE", "302-000-0002");
        when(resourceService.getResourcesByCategory("Food")).thenReturn(List.of(resource));

        mockMvc.perform(get("/api/resources/category/Food"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Local Food Bank"))
                .andExpect(jsonPath("$[0].category").value("Food"));
    }
}
