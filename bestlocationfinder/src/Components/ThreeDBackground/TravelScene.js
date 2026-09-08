function TravelScene() {
  const panoramaStyle = {
    backgroundImage: `url(${process.env.PUBLIC_URL}/assets/exploreplace-nature-3d.png)`,
  };

  return (
    <div className="travel-scene-shell nature-scene" aria-hidden="true">
      <div className="travel-scene-sticky nature-scene-sticky">
        <div className="nature-panorama nature-panorama-base" style={panoramaStyle} />
        <div className="nature-panorama nature-panorama-depth" style={panoramaStyle} />
        <div className="nature-light-rays"><i /><i /><i /></div>
        <div className="nature-mist nature-mist-one" />
        <div className="nature-mist nature-mist-two" />
        <div className="nature-water"><i /><i /><i /><i /></div>
        <div className="nature-leaves">
          {Array.from({ length: 14 }).map((_, index) => (
            <i key={index} style={{ "--leaf": index, "--leaf-left": `${(index * 19) % 96}%` }} />
          ))}
        </div>
        <span className="nature-butterfly butterfly-one"><i /><b /></span>
        <span className="nature-butterfly butterfly-two"><i /><b /></span>
        <span className="nature-butterfly butterfly-three"><i /><b /></span>
        <div className="nature-vignette" />
      </div>
    </div>
  );
}

export default TravelScene;
