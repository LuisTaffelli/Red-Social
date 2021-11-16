import style from "./NewPost.module.css";
import { useState } from "react";
import { createPost, updatePage } from "../../Redux/actions/Post.js";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import validate from "../../utils/validate";
import ImageUpload from "../ImageUpload/ImageUpload";
import Tags from "../Tags/Tags";
export default function NewPost({orden, tags}) {
  const dispatch = useDispatch();
  const session = useSelector((state) => state.sessionReducer || {});
  const [data, setData] = useState({
    title: "",
    content: "",
    image: null,
    tag: [],
    likes: 0,
    username: session.username,
  });

  const [errores, setErrores] = useState({
    title: "",
    content: "",
  });

  const type = [
    { value: "normal", label: "Normal" },
    { value: "challenge", label: "Challenge" },
  ];

  /*function separarTags(str) {
    var arr = str.split(",");
    setData((old) => ({
      ...old,
      tag: arr,
    }));
  }*/

  function handleChange({ target: { name, value } }) {
    setData((old) => ({ ...old, [name]: value }));
    setErrores((old) => ({ ...old, [name]: validate(name, value) }));
  }

  const handleSelect = (e) => {
    setData((old) => ({ ...old, tag: e.map((option) => option.value) }));
  };

  const handleImage = (e) => {
    if (!e) return setData((old) => ({ ...old, image: null }));

    const {
      target: { name, files },
    } = e;

    setData((old) => ({ ...old, [name]: files[0] }));
  };

  async function handleSubmit(e) {
    e.preventDefault();

    if (!Object.values(errores).filter((error) => error).length) {
      const formData = new FormData();
      if (!session.dayBan) {
        formData.append("title", data.title);
        formData.append("content", data.content);
        formData.append("image", data.image);
        formData.append("tag", data.tag);
        formData.append("username", data.username);
        formData.append("type",data.type)

        let errores = await dispatch(createPost(formData, orden, tags));
        if (errores.type === "ERROR") {
          alert(errores.payload.response.data.error.errors[0].message)
        }else {
          setData({
            title: "",
            content: "",
            image: null,
            tag: [],
            likes: 0,
            type: "normal",
            username: session.username,
          });
        }
      } else {
        alert("You are banned, therefore you cannot post anything");
      }

      //console.log(obj);
      //dispatch(updatePage(true, obj.payload.posts));
    }
  }

  return (
    <form className={style.container} onSubmit={(e) => handleSubmit(e)}>
      <label className={style.wrapper}>
        Title
        <div className="input-group">
          <input
            value={data.title}
            onChange={handleChange}
            name="title"
            type="text"
            placeholder="Title"
            autoComplete="off"
          />
        </div>
        <span>{errores.title}</span>
      </label>

      <label className={style.wrapper}>
        Content {data.content.length}/1000
        <textarea
          value={data.content}
          onChange={handleChange}
          name="content"
          type="text"
          autoComplete="off"
          placeholder="Your message"
        />
        <span>{errores.content}</span>
      </label>

      <ImageUpload onChange={handleImage} />

      <label className={style.wrapper}>
      <Tags tags={[]} mode={true} handleSelect={handleSelect} editTags={data.tag}/>

        {/*<Select
          onChange={handleSelect}
          options={options}
          menuPlacement="top"
          placeholder="Tags"
          value={data.tag.map((t)=>({label:t, value:t}))}
          isMulti
        />*/}
        <span className={style.error}></span>
      </label>

      <button className={style.submit} type="submit">
        Crear
      </button>
    </form>
  );
}
