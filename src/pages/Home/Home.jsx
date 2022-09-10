import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { EffectCoverflow, Pagination, Autoplay } from "swiper";
import "./styles.css";

import { db } from "../../utils/firebase";
import { getDocs, collection } from "firebase/firestore";

const Home = () => {
  const [imgUrlArr, setImgUrlArr] = useState([]);
  useEffect(() => {
    let arr = [];
    const getPost = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      querySnapshot.forEach((doc) => {
        if (arr.length < 10) {
          arr.push(doc.data().url);
        }
      });
      arr.sort(() => Math.random() - 0.5);
      setImgUrlArr(arr);
    };
    getPost();
  }, []);
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
              <img src={item} onClick={() => console.log("hello")} alt="img" />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Home;
