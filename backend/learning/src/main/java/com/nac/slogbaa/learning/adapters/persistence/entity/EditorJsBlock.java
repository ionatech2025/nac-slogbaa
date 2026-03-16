package com.nac.slogbaa.learning.adapters.persistence.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.Map;

/**
 * One block in Editor.js output. type: paragraph, header, list, image, embed, etc.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class EditorJsBlock {

    private String type;
    private Map<String, Object> data;

    public EditorJsBlock() {}

    public EditorJsBlock(String type, Map<String, Object> data) {
        this.type = type;
        this.data = data;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Map<String, Object> getData() {
        return data;
    }

    public void setData(Map<String, Object> data) {
        this.data = data;
    }
}
