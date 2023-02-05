import React, { useState } from "react";
import { connect } from "react-redux";
import { addInputSearch } from "../redux/actions";

const AddInputSearch = (props) => {
  const [input,setInput] = useState('');

  const updateInput = input => {
    setInput( input );
  };

  const handleAddInputSearch = () => {
    props.addInputSearch(input);
    setInput( '' );
  };
  return (
    <div>
      <input
        onChange={e => updateInput(e.target.value)}
        value={input}
      />
      <button onClick={handleAddInputSearch}>
        Add Input Search
      </button>
    </div>
  );
}
 
export default connect(null, { addInputSearch })(AddInputSearch);

