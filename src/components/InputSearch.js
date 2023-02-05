import React from "react";
import { connect } from "react-redux";
import { ListItem, ListItemText } from "@material-ui/core";

const InputSearch = ({ input }) => (
    <ListItem>
        <ListItemText primary={input.content} />
    </ListItem>
);

export default connect(null)(InputSearch);
