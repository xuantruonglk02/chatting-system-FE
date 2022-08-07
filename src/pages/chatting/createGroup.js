import { IoMdClose } from "react-icons/io";
import { memo, useEffect, useState } from "react";
import { BsCameraFill } from "react-icons/bs";
import { BsSearch } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";
import { TiTick } from "react-icons/ti";
import { SearchUserApi } from "../../redux/apiRequest";

const CreateGroup = (props) => {
  const [listUserPicked, setListUserPicked] = useState([]);
  const [groupName, setGroupName] = useState();
  const { setDisplayCreateGroup, token, createGroup, userId } = props;
  const [resultSearched, setResultSearched] = useState([]);
  const [allowCreate, setAllowCreate] = useState('disable')
  const [displayLoader, setDisplayLoader] = useState('none')

  const handleClose = () => {
    setDisplayCreateGroup("none");
    setGroupName('')
    setAllowCreate('disable')
    setListUserPicked([]);
    setResultSearched([]);
  };
  const onKeySearchChange = (e) => {
    if (e.target.value) SearchUserApi(token, e.target.value, setResultSearched);
  };
  const onGroupNameChange = (e) => {
    setGroupName(e.target.value)
  }
  const handleAddUserToTemp = (item) => {
    if(item._id === userId) return
    let temp = listUserPicked
    temp.push(item);
    setListUserPicked([...temp]);
  };
  const handleRemoveToTemp = (index) => {
    let temp = listUserPicked
    temp.splice(index, 1);
    setListUserPicked([...temp]);
  };

  const handleCreateGroup = async () => {
    if(!groupName) {
      alert('Tên group không được để trống!')
    }
    if(allowCreate === 'disable') return 
    let userIds = []
    for(let i = 0; i < listUserPicked.length; i++) {
      userIds.push(listUserPicked[i]._id)
    }
    userIds.push(userId)
    let data = {
      title: groupName,
      userIds: userIds,
    }
    setAllowCreate('isLoading')
    setDisplayLoader('block')
    await createGroup(data)
    handleClose()
  }
  useEffect( () => {
    if(listUserPicked.length > 1) {
      setAllowCreate('')
    } else {
      setAllowCreate('disable')
    }
  }, [listUserPicked])
  return (
    <>
      <div className="overlay"></div>
      <div className="main">
        <h4>
          {" "}
          Tạo nhóm <IoMdClose className="x-close" onClick={handleClose} />
        </h4>
        <div className="name-of-group">
          <BsCameraFill className="camera" />
          <input placeholder="Nhập tên nhóm..." value={groupName} onChange={e => onGroupNameChange(e)}></input>
        </div>
        <div className="list-user-picked">
          {listUserPicked.map((item, index) => (
            <div className="item" key={index}>
              <img src={require(`../../assests/image/avatar5.png`)} />
              <IoMdClose
                className="icon-close"
                onClick={(e) => handleRemoveToTemp(index)}
              />
            </div>
          ))}
        </div>
        <p className="ps-3">Thêm bạn bè vào nhóm</p>
        <div className="search-box">
          <BsSearch className="icon-search" />
          <input
            placeholder="Nhập email hoặc tên người dùng"
            onChange={(e) => onKeySearchChange(e)}
          />
        </div>
        <div className="list-user-match-key">
          {resultSearched.map((item, index) => {
            let isPicked = false;
            for (let i = 0; i < listUserPicked.length; i++) {
              if (item._id === listUserPicked[i]._id) {
                isPicked = true;
                break;
              }
            }
            return (
              <div className="item" key={index}>
                <img src={require(`../../assests/image/avatar5.png`)} />
                <span>{item.name}</span>
                {isPicked ? (
                  <TiTick className="icon-tick" />
                ) : (
                  <AiOutlinePlus
                    className="icon-plus"
                    onClick={(e) => handleAddUserToTemp(item)}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="btns-action">
          <button onClick={handleClose}>Huỷ</button>
          <button className={allowCreate} onClick={handleCreateGroup}>Tạo nhóm</button>
          <div className="loader" style={{display: `${displayLoader}`}}></div>
        </div>
      </div>
    </>
  );
};

export default memo(CreateGroup);