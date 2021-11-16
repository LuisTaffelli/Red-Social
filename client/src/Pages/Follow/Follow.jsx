import { useState } from "react";
import { useDispatch } from "react-redux";
import { followUnfollow } from "../../Redux/actions/Users";
import styles from "./Follow.module.css";
import { Link,useLocation } from "react-router-dom";
import { Redirect } from "react-router"
import userimg from "../../images/userCard.svg";

export default function Follow({props}) {

  const [popup,setPopup] = useState(false)
  const [style, setStyle] = useState("none")
  const {user,followers,following, profile,follow} = props

  const handleClick = (e)=>{

    if(e.target.id == "Followers"){
      setPopup(true)
      return setStyle("Followers")
    }else if(e.target.id == "Following"){
      setPopup(true)
      return setStyle("Following")
    }else if(e.target.className.includes("close")){
      setPopup(false)
    }
  }

  return (
    <div className={styles.container}>
      <span id="Followers" onClick={(e)=> handleClick(e)}><strong>{following?.length}</strong> Followers</span>
      <span>&nbsp;&nbsp;</span>
      <span id="Following" onClick={(e)=> handleClick(e)}><strong>{followers?.length}</strong> Following</span>
      {  
        !popup?
          <></>:
        popup && style === "Followers"?
          <div className={`close ${styles.popup}`} onClick={(e)=> handleClick(e)} >
            <section>      
              <h2>Followers</h2>
              <br/>
              {following?.map(e=><div className={styles.followers}>
                <img src={e.image? e.image:userimg} alt="Usuario"/>
                <div>
                  <Link onClick={()=>setPopup(false)} to={e.username}>{e.username}</Link>
                  <p>{e.name}</p>                  
                </div>
              </div>)}
            </section>
          </div>:
        popup && style === "Following"?
          <div className={`close ${styles.popup}`} onClick={(e)=> handleClick(e)} >
            <section>     
              <h2>Following</h2>
              <br/>
              {followers?.map(e=><div className={styles.followers}>
                <img src={e.image? e.image:userimg} alt="Usuario"/>
                <div>
                  <Link onClick={()=>setPopup(false)} to={e.username}>{e.username}</Link>
                  <p>{e.name}</p>                  
                </div>
              </div>)}
            </section>
          </div>:
        <></>
      }

    </div>
    );
}

export function FollowBtn({props}){
  const {user, follow, info} = props
  const $follows = info.some(e=> e.username === user)
  const [Follow, SetFollow] = useState($follows)
  const dispatch = useDispatch()

  const handleClick = (e) => {
    if(!user || !follow) return
    dispatch(followUnfollow({user,follow}))
    SetFollow(!Follow)
  };
  return (
    <div className={styles.container}>
      <div className={styles.containerBtn}>
        <button onClick={(e)=> handleClick(e)} className={Follow? styles.unfollow: styles.follow}>
          {Follow === true? "Unfollow": "Follow"}
        </button> 
      </div>
    </div>
    );
}


