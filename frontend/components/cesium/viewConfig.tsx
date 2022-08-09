import {
    Cartesian3,
    Cartographic,
    Cesium3DTileset,
    createWorldTerrain,
    HeadingPitchRoll,
    // MapboxStyleImageryProvider,
    Matrix4,
    Viewer
} from "cesium";

/////////////////////////////////////////////////////////////////////////
//  INITIAL CAMERA AND HOME POSITION
//////////////////////////////////////////////////////////////////////////
export function makeHome(viewer: any) {
    const initialPosition = Cartesian3.fromDegrees(8.549607, 47.342455, 2631.082799425431);
    const initialOrientation = HeadingPitchRoll.fromDegrees(-20, -32, 0)
    const homeCameraView = {
        destination: initialPosition,
        orientation: {
            heading: initialOrientation.heading,
            pitch: initialOrientation.pitch,
            roll: initialOrientation.roll
        }
    };
    // Set the initial view
    viewer.scene.camera.setView(homeCameraView);
    viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (e: any) {
        e.cancel = true;
        viewer.scene.camera.flyTo(homeCameraView);
    })
}


/////////////////////////////////////////////////////////////////////////
//  BASEMAP CONFIG  ********************NOT USED********************
//////////////////////////////////////////////////////////////////////////
// export function initializeMapboxBasemap(viewer: any) {
//     const mapboxCustomBasemap = new MapboxStyleImageryProvider({
//         styleId: 'dark-v10',
//         accessToken: process.env.REACT_APP_MAPBOX_TOKEN
//     });
//     // Remove default base layer
//     if (viewer) {
//         viewer.imageryLayers.remove(viewer.imageryLayers.get(0));
//         viewer.imageryLayers.addImageryProvider(mapboxCustomBasemap)
//     }
// }
/////////////////////////////////////////////////////////////////////////
//  POSITION TILES
//////////////////////////////////////////////////////////////////////////
export const positionTileset = (tileset: Cesium3DTileset) => {
    const heightOffset = 0;
    // const heightOffset = -32;
    const boundingSphere = tileset.boundingSphere;
    const cartographic = Cartographic.fromCartesian(boundingSphere.center);
    const surfacePosition = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
    const offsetPosition = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
    const translation = Cartesian3.subtract(offsetPosition, surfacePosition, new Cartesian3());
    tileset.modelMatrix = Matrix4.fromTranslation(translation);
};

/////////////////////////////////////////////////////////////////////////
//  LOADING TERRAIN
//////////////////////////////////////////////////////////////////////////

// Load Cesium World Terrain
export const loadTerrain = (viewer: Viewer) => {
    viewer.terrainProvider = createWorldTerrain({
        // requestWaterMask : true, // required for water effects
        // requestVertexNormals: true // required for terrain lighting
    });
    // Enable depth testing so things behind the terrain disappear.
    viewer.scene.globe.depthTestAgainstTerrain = true;
};
