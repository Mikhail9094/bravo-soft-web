import style from "./Loading.module.scss";

const Loading = () => {
  return (
    <div className={style.loaderWrapper}>
      <div className={style.loader}></div>
    </div>
  );
};

export default Loading;
