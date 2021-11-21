import React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  width: 100%;
  padding: 10px 20px;
  border: 1px solid #ddd;
  border-radius: 8px; 
 
  outline: none;
  margin-top: 0.2rem;
  margin-bottom: 1rem;
  box-sizing: border-box;

  &:focus {
    border: 1.5px solid #ee5057;
  }
`

const StyledLabel = styled.label`

`

export default function Input(props) {

  return (
    <div>
      <StyledLabel>{props.label}</StyledLabel>
      <StyledInput {...props}/>
    </div>
  )
}