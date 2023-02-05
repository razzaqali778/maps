import { List } from "@material-ui/core";
import React, { Fragment } from "react";
import { connect } from "react-redux";
import InputSearch from "./InputSearch";

const InputSearchList = ({ inputSearch }) => (
   <Fragment>
      <div style={{ margin:`0 2rem 4rem 0` }}>
         <h3>User Search History List</h3>  
         <List>
            {inputSearch && inputSearch.length
            ? inputSearch.map((input, index) => {
                  return  <InputSearch key={`input-${input.id}`} input={input} />;
               })
            : "No search history!"}
         </List>
      </div>
   </Fragment>
);

const mapStateToProps = state => {
  const { byIds, allIds } = state.inputSearch || {};
  const inputSearch =
    allIds && state.inputSearch.allIds.length
      ? allIds.map(id => (byIds ? { ...byIds[id], id } : null))
      : null;
  return { inputSearch };
};

export default connect(mapStateToProps)(InputSearchList);
