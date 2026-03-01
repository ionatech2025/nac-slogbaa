package com.nac.slogbaa.learning.core.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Objects;

/**
 * A single line of text within a TEXT block.
 * type: paragraph | bullet | numbered
 */
public final class TextLine {
    private final String id;
    private final String type;
    private final String content;
    private final int indent;

    @JsonCreator
    public TextLine(
            @JsonProperty("id") String id,
            @JsonProperty("type") String type,
            @JsonProperty("content") String content,
            @JsonProperty("indent") int indent) {
        this.id = Objects.requireNonNull(id);
        this.type = type != null ? type : "paragraph";
        this.content = content != null ? content : "";
        this.indent = indent >= 0 ? indent : 0;
    }

    public String getId() { return id; }
    public String getType() { return type; }
    public String getContent() { return content; }
    public int getIndent() { return indent; }
}
