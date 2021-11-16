import styles from "./Tags.module.css";
import Select from "react-select";
import { useSelector, useDispatch} from "react-redux";
import { useState, useEffect } from "react";
import { getTags, loadTags } from "../../Redux/actions/Post";


function Tags({ tags, mode, handleSelect, editTags }) {
  const dispatch = useDispatch();
  const allTags = useSelector((state) => state.postsReducer.tags);
  const [optionsTags, setOptionsTags] = useState(allTags.map((tag) => {
      if (!tags.includes(tag.label)) {
        return tag
      }}).filter((tag)=> tag!== undefined)); //El select no funciona sin un array de objetos con value y label

  useEffect(async () => {
    setOptionsTags(
      allTags.map((tag) => {
        if (!tags.includes(tag.label)) {
          return tag
        }}).filter((tag)=> tag!== undefined)
    );
  }, []);
  useEffect(()=>{

    if (editTags && editTags.length < tags.length) {
      setOptionsTags(
        allTags.map((tag) => {
          if (!editTags.includes(tag.label)) {
            return tag
          }}).filter((tag)=> tag!== undefined)
      );
    }
  },[editTags])

  return (
    <>
      {mode ? <Select
        onChange={(e)=>handleSelect(e)}
        options={optionsTags}
        placeholder="Tags"
        defaultValue={tags.map((tag)=>({label:tag, value:tag}))}
        value={editTags.map((tag)=>({label:tag, value:tag}))}
        isMulti
      /> :
        <ul className={styles.tags}>
          {tags && tags.length ? (
            tags.map((tag) => <li className={styles.tag}>{tag}</li>)
          ) : (
            <></>
          )}
        </ul>
      }
    </>
  );
}

export default Tags;
