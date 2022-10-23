import { useContext } from "react";
import { Navigate } from "react-router-dom";
import SwiperCore, { Autoplay, EffectCoverflow, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { AuthActionKind } from "../../store/authReducer";
import { Context, ContextType } from "../../store/ContextProvider";
import "./styles.css";
SwiperCore.use([Autoplay, Pagination, EffectCoverflow]);

const Home = () => {
  const { authState, authDispatch, postState } = useContext(
    Context
  ) as ContextType;
  const imgUrlArr = postState.allPost.slice(0, 10).map((item) => item.url);

  if (authState.isLogged) {
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
          effect="coverflow"
          grabCursor={true}
          centeredSlides
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
          className="mySwiper"
        >
          {imgUrlArr.map((item, index) => {
            return (
              <SwiperSlide
                key={index}
                style={{
                  cursor: "pointer",
                  backgroundImage: `url(${item})`,
                }}
                onClick={() => {
                  authDispatch({ type: AuthActionKind.TOGGLE_LOGIN });
                }}
              ></SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    );
  }
};

export default Home;
