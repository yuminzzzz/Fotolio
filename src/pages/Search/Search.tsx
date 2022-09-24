import { useContext, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { GlobalContext } from "../../App";
import PinterestLayout from "../../component/PinterestLayout";

const Search = () => {
  const keyword = useParams().search;
  return <div>{keyword}</div>;
};

export default Search;
