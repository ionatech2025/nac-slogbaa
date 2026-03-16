package com.nac.slogbaa.learning.adapters.persistence.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.List;

/**
 * Editor.js root output: { "time": 123..., "blocks": [ ... ] }
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class EditorJsData {

    private long time;
    private List<EditorJsBlock> blocks = new ArrayList<>();

    public EditorJsData() {}

    public EditorJsData(long time, List<EditorJsBlock> blocks) {
        this.time = time;
        this.blocks = blocks != null ? blocks : new ArrayList<>();
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }

    public List<EditorJsBlock> getBlocks() {
        return blocks;
    }

    public void setBlocks(List<EditorJsBlock> blocks) {
        this.blocks = blocks != null ? blocks : new ArrayList<>();
    }
}
