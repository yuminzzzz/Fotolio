import React, { useEffect, useState, useContext } from "react";
import { GlobalContext } from "../../App";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Pagination, Autoplay } from "swiper";
import "./styles.css";

import { db } from "../../utils/firebase";
import { getDocs, collectionGroup, DocumentData } from "firebase/firestore";
import { Navigate } from "react-router-dom";

const Home = () => {
  const [imgUrlArr, setImgUrlArr] = useState([]);
  const st: any = useContext(GlobalContext);

  useEffect(() => {
    let arr: any = [];
    const getPost = async () => {
      const userPost = collectionGroup(db, "user_posts");
      const querySnapshot = await getDocs(userPost);

      querySnapshot.forEach((doc: DocumentData) => {
        if (arr.length < 10) {
          arr.push(doc.data().url);
        }
      });
      arr.sort(() => Math.random() - 0.5);
      setImgUrlArr(arr);
    };
    getPost();
  }, []);
  if (st.isLogged) {
    return <Navigate to="/home" />;
  } else {
    return (
      <div
        style={{
          width: "100vw",
          height: "calc(100vh - 80px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: "80px",
          padding: "0 50px",
        }}
      >
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          slidesPerView={window.innerWidth < 768 ? 1 : "auto"}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="mySwiper"
        >
          {imgUrlArr.map((item, index) => {
            return (
              <SwiperSlide key={index}>
                <img
                  src={item}
                  style={{ cursor: "pointer" }}
                  onClick={() => st.setLogin(true)}
                  alt="img"
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    );
  }
};

export default Home;
