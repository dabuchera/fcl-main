import { Cesium3DTileFeature, Cesium3DTileset, Cesium3DTileStyle, PostProcessStageLibrary, ScreenSpaceEventType, Viewer } from "cesium";
import { Color, defined } from "cesium";
import { styles } from "./featureStyles";
// import { tenants, owners } from "../data/data";

let selectedFloor = {
  currentFeature: null,
  previousColor: null,
};

export const viewerLeftClickTest = (viewer: Viewer, tileset: any) => {
  viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement: any) {
    const pickedFeature : Cesium3DTileFeature = viewer.scene.pick(movement.position);
    if (defined(pickedFeature)) {
      console.log(pickedFeature);
      console.log(pickedFeature.getProperty("name"));
      console.log(pickedFeature.getPropertyNames());
      pickedFeature.color = Color.RED.withAlpha(0.8);
      return true;
    } else {
      tileset.style = styles.defaultStyle;
      return true;
    }

    // // Silhouettes are supported
    // const silhouetteBlue = PostProcessStageLibrary.createEdgeDetectionStage();
    // silhouetteBlue.uniforms.color = Color.BLUE;
    // silhouetteBlue.uniforms.length = 0.01;
    // silhouetteBlue.selected = [];

    // const silhouetteGreen = PostProcessStageLibrary.createEdgeDetectionStage();
    // silhouetteGreen.uniforms.color = Color.LIME;
    // silhouetteGreen.uniforms.length = 0.01;
    // silhouetteGreen.selected = [];

    // viewer.scene.postProcessStages.add(PostProcessStageLibrary.createSilhouetteStage([silhouetteBlue, silhouetteGreen]));
  }, ScreenSpaceEventType.LEFT_CLICK);
};

export const viewerLeftClick = (viewer: any, tileset: any, setter: Function, currentSelection = null) => {
  console.log("ajkshdnlkasj");

  let floorProperties = {
    floorNumber: null,
    featureName: "",
    owner: "",
    tenant: "",
    id: "",
  };

  // HANDLE CLICK OUTSIDE TILESET  (reset colors, empties property object, closes popup)
  // viewer.screenSpaceEventHandler.getInputAction(ScreenSpaceEventType.LEFT_CLICK);
  viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement: any) {
    const pickedFeature = viewer.scene.pick(movement.position);
    if (!defined(pickedFeature) || !pickedFeature.getProperty("floor_number")) {
      // reset color of floors if clicking on any feature other than floors
      tileset.style = styles.defaultStyle;
      if (selectedFloor && selectedFloor.previousColor) {
        // @ts-ignore
        selectedFloor.currentFeature.color = selectedFloor.previousColor;
        selectedFloor = {
          previousColor: null,
          currentFeature: null,
        };
      }
      return setter(null);
    }

    //IF SAME ENTITY, DO NOTHING
    //If this is not implemented, clicking on entities twice permanently changes their colors
    if (selectedFloor.currentFeature) {
      if (
        // @ts-ignore
        selectedFloor.currentFeature.getProperty("floor_id") === pickedFeature.getProperty("floor_id")
      ) {
        return;
      }
    }

    floorProperties.floorNumber = pickedFeature.getProperty("floor_number");
    floorProperties.featureName = pickedFeature.getProperty("Name");
    floorProperties.id = pickedFeature.getProperty("PropertyID");
    // @ts-ignore
    floorProperties.tenant = tenants[pickedFeature.getProperty("floor_id")] || "Vacant";
    // @ts-ignore
    floorProperties.owner = owners[pickedFeature.getProperty("PropertyID")];

    // @ts-ignore
    if (selectedFloor.currentFeature && selectedFloor.currentFeature.getProperty("OBJECTID") !== pickedFeature.getProperty("OBJECTID")) {
      // @ts-ignore
      selectedFloor.currentFeature.color = selectedFloor.previousColor;
      selectedFloor.currentFeature = pickedFeature;
    }

    selectedFloor.currentFeature = pickedFeature;
    selectedFloor.previousColor = pickedFeature.color;
    pickedFeature.color = Color.RED.withAlpha(0.8);
    // TODO: Implement reverting to original color

    return setter(floorProperties);
  }, ScreenSpaceEventType.LEFT_CLICK);
};

function generateStyle(feature: string | number, arr: Array<string>) {
  let featureName;
  featureName = "${" + feature + "}";

  let selection = "";
  for (let i = 0; i < arr.length; i++) {
    if (i + 1 === arr.length) {
      if (typeof arr[0] === "string") {
        selection += `${featureName} === "${arr[i]}"`;
      } else {
        selection += `${featureName} === ${arr[i]}`;
      }

      return selection;
    }
    if (typeof arr[0] == "string") {
      selection += `${featureName} === "${arr[i]}" ||`;
    } else {
      selection += `${featureName} === ${arr[i]} ||`;
    }
  }
}

export function colorFloors(featureSet: Cesium3DTileset, feature: string, arr: Array<any>) {
  const cond = [
    [generateStyle(feature, arr), "rgb(23,83,246)"],
    // EXAMPLE OUTPUT:
    // [' ${floor_id} === "42635-19" || ${floor_id} === "42635-2" || ${floor_id} === "805078-50" || ${floor_id} === "42592-34"', 'rgb(23,83,246)'],
    // ['${floor_number} === 12', 'rgb(23,83,246)'],
    // ['${floor_number} === 22', 'rgb(23,83,246)'],
    ["true", "rgb(237,244,246)"],
  ];
  // @ts-ignore
  featureSet.style = new Cesium3DTileStyle({
    color: {
      conditions: cond,
    },
  });
}

export const makeMatchList = (feature: any, selector: string, isString = false) => {
  const matching = [];
  for (let [id, o] of Object.entries(feature)) {
    if (o === selector && !isString) {
      matching.push(parseInt(id));
    }

    if (o === selector && isString) {
      matching.push(id);
    }
  }
  return matching;
};
