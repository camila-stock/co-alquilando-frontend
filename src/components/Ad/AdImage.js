/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import getWindowSize from "../../util/getWindowSize";
import ApiRequest from "../../util/ApiRequest";
import hostname from '../../util/getHostName';

const AdImage = (props) => {
  const { position } = props;
  const [ad, setAd] = useState();
  const [visible, setVisible] = useState(true);
  const isVertical = position === 'vertical';

  const modifier = `ad-image--${position}`;
  const className = ['ad-image', modifier];
  let windowSize = getWindowSize();

  useEffect(() => {
    if (!ad) {
      const getImage = async () => {
        const {data} = await ApiRequest.get(
          '/ad/toDisplay', {isVertical}
        );
        setAd(data);
      };
      getImage();
    }
  }, [ad, isVertical]);

  const closeAd = () => {
    setVisible(false);
  }

  const renderAdImage = () =>
    ad && (
      <div className="ad-image__container">
        <a target="_blank" href={ad?.url}>
        <img
          src={`${hostname}/ad/${ad.id}/image/${ad.image}`}
          alt="ad"
        />
        </a>
        <div
          style={{color:"#fff"}}
          className="ad-image__button"
          onClick={closeAd}
        >X</div>
      </div>
    );

  return (
    <div className={className.join(' ')}>
      {visible && windowSize[0] > 600 && renderAdImage()}
    </div>
  );
};

export default AdImage;
