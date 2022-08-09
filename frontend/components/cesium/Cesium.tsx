import { Viewer, Entity, PointGraphics, EntityDescription, Cesium3DTileset, Camera, CameraLookAt } from "resium";
import { Cartesian3, createWorldTerrain, HeadingPitchRoll, IonResource } from "cesium";

import { loadTerrain, makeHome } from "./viewConfig";

const terrainProvider = createWorldTerrain();

export default function Cesium() {

  let viewer:any; // This will be raw Cesium's Viewer object.

  const handleReady = () => {
    if (viewer) {
      makeHome(viewer);
    }
  };
  
  return (
    <Viewer 
    style={{
      position: "absolute",
      top: 0,
      left: "25%",
      right: 0,
      bottom: 0,
    }}
    useBrowserRecommendedResolution={true}
    animation={false}
    geocoder={false}
    sceneModePicker={false}
    timeline={false}
    baseLayerPicker={true}
    terrainProvider={terrainProvider}
    ref={e => {
      viewer = e && e.cesiumElement;
    }}
    >
    <Cesium3DTileset url={IonResource.fromAssetId(96188)} onReady={handleReady} />
    </Viewer>
  )
}