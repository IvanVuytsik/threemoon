import { Scene, PerspectiveCamera, WebGLRenderer, DirectionalLight, MeshPhysicalMaterial, Mesh, 
SphereGeometry, PCFShadowMap, Color, sRGBEncoding, ACESFilmicToneMapping, TextureLoader, PMREMGenerator,
FloatType, Group, Vector3, Vector2, Clock, PlaneGeometry, DoubleSide, RingGeometry } from "https://cdn.skypack.dev/three@0.137";
import { OrbitControls } from "https://cdn.skypack.dev/three-stdlib@2.8.5/controls/OrbitControls";
import { RGBELoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/RGBELoader";
import { GLTFLoader } from "https://cdn.skypack.dev/three-stdlib@2.8.5/loaders/GLTFLoader";
import anime from "https://cdn.skypack.dev/animejs@3.2.1";
 


let sunBG = document.querySelector(".light-bg");
let moonBG = document.querySelector(".dark-bg");
//-----------------------------------------------------------------
const scene = new Scene();
const camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
camera.position.set(0,15,50);

//----------------------------Scene2------------------------------
const overlayScene = new Scene();
const overlayCamera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 1000);
overlayCamera.position.set(0,15,50);


//-----------------------------------------------------------------
const renderer = new WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(innerWidth, innerHeight);
renderer.toneMapping = ACESFilmicToneMapping;
renderer.outputEncoding = sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFShadowMap;
document.body.appendChild(renderer.domElement);
//-----------------------------------------------------------------

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.dampingFactor = 0.05;
controls.enableDamping = true;

//-----------------------------------------------------------------
const sunLight = new DirectionalLight(new Color("#ffffff"), 3.5);
sunLight.position.set(10, 20, 10);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 128;
sunLight.shadow.mapSize.height = 128;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 100;
sunLight.shadow.camera.left = -10;
sunLight.shadow.camera.bottom = -10;
sunLight.shadow.camera.top = 10;
sunLight.shadow.camera.right = 10;
scene.add(sunLight);

//-----------------------------------------------------------------
const moonLight = new DirectionalLight(new Color("#572651").convertSRGBToLinear(), 0);
moonLight.position.set(-10, 20, 10);
moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 128;
moonLight.shadow.mapSize.height = 128;
moonLight.shadow.camera.near = 0.5;
moonLight.shadow.camera.far = 100;
moonLight.shadow.camera.left = -10;
moonLight.shadow.camera.bottom = -10;
moonLight.shadow.camera.top = 10;
moonLight.shadow.camera.right = 10;
scene.add(moonLight);
//---------------------------------------------------------------------------

let colorsData = {
    color1: '#572651', 
    color2: '#76A21E', 
    color3: '#F79C1D',
 }

//---------------------------OverlayObj Rotation-----------------------------
let mousePos = new Vector2(0,0);
window.addEventListener('mousemove', (e) => {
    let x = e.clientX - innerWidth * 0.5;
    let y = e.clientY - innerHeight * 0.5;

    mousePos.x = x * 0.0003;
    mousePos.y = y * 0.0003;
});


//-----------------------------------------------------------------
(async function () {

    //--------------------------------EnvMap--------------------------------
    let pmrem = new PMREMGenerator(renderer);
    let envmapTexture = await new RGBELoader().setDataType(FloatType).loadAsync('./images/envMap.hdr');
    let envMap = pmrem.fromEquirectangular(envmapTexture).texture;

    //--------------------------------OVERLAY-------------------------------
    const overlayObjA = new Mesh(
        new RingGeometry(13, 12, 80, 1, 0),
        new MeshPhysicalMaterial({
            color: new Color('#572651').convertSRGBToLinear(),
            roughness: 0.25, 
            envMap, 
            envMapIntensity: 2.0,
            side: DoubleSide,
            transparent: true,
            opacity: 0.4,
        })
    );
    overlayObjA.position.set(0, 15.5, 0);
    overlayObjA.sunOpacity = 0.4;
    overlayObjA.moonOpacity = 0.05;
    overlayScene.add(overlayObjA);

     //------------------------------
    const overlayObjB = new Mesh(
        new RingGeometry(15, 14, 80, 1, 0),
        new MeshPhysicalMaterial({
            color: new Color('#572651').convertSRGBToLinear(),
            roughness: 0.25, 
            envMap, 
            envMapIntensity: 2.0,
            side: DoubleSide,
            transparent: true,
            opacity: 0.3,
        })
    );
    overlayObjB.position.set(0, 15.5, 0);
    overlayObjB.sunOpacity = 0.35;
    overlayObjB.moonOpacity = 0.05;
    overlayScene.add(overlayObjB);
     //------------------------------
    const overlayObjC = new Mesh(
        new RingGeometry(17, 16, 80, 1, 0),
        new MeshPhysicalMaterial({
            color: new Color('#572651').convertSRGBToLinear(),
            roughness: 0.25, 
            envMap, 
            envMapIntensity: 2.0,
            side: DoubleSide,
            transparent: true,
            opacity: 0.2,
        })
    );
    overlayObjC.position.set(0, 15.5, 0);
    overlayObjC.sunOpacity = 0.2;
    overlayObjC.moonOpacity = 0.1;
    overlayScene.add(overlayObjC);
     //------------------------------


    //--------------------------------TEXTURES--------------------------------
    let textures = {
        map: await new TextureLoader().loadAsync('./images/moonMainB.png'),
        trailMask: await new TextureLoader().loadAsync('./images/mask.png'),
        // bump: await new TextureLoader().loadAsync('./images/NormalMap.png'),
        // spec: await new TextureLoader().loadAsync('./images/SpecularMap.png'),
    };
    //---------------------------------------------
     //-----------------------staticObject----------------------
    let staticObject = (await new GLTFLoader().loadAsync('./assets/hut.glb')).scene.children[0];
    staticObject.scale.set(0.4, 0.4, 0.4);
    staticObject.position.set(0,0,0);
    staticObject.rotation.set(140,0,10);
    staticObject.updateMatrixWorld();
    staticObject.material.envMap = envMap;
    staticObject.castShadow = true;
    staticObject.receiveShadow = true;

    staticObject.sunMapIntensity = 0.5;
    staticObject.moonMapIntensity = 0.5;
   
    scene.add(staticObject);

    //--------------------object-------------------
    let object = (await new GLTFLoader().loadAsync('./assets/witch.glb')).scene.children[0];
    let objectsData = [
        newObject(object, textures.trailMask, envMap, scene),
        // newObject(object, textures.trailMask, envMap, scene),
        // newObject(object, textures.trailMask, envMap, scene),
    ];
       
    //---------------world-----------------
    let sphere = new Mesh(
        new SphereGeometry(2, 20, 20),
        new MeshPhysicalMaterial({
            map: textures.map,
      
            // roughnessMap: textures.spec,
            // bumpMap: textures.bump,
            // bumpScale: 0.05,
            envMap,
            envMapIntensity: 0.5,

            sheen: 1,
            sheenRoughness: 0.75,
            sheenColor: new Color('#ff8a00').convertSRGBToLinear(),
            clearcoat: 0.5,
        }),
    )
    sphere.sunMapIntensity = 0.4;
    sphere.moonMapIntensity = 0.3;

    sphere.rotation.y += Math.PI * 1.25;
    sphere.receiveShadow = true;

    sphere.position.set(-5,30,0);
    overlayScene.add(sphere);
    //--------------------------------------------

    //----------------Clock------------------------
    let clock = new Clock();

    //-------------------Animate----------------------
    let daytime = true;
    let animating = false;

    window.addEventListener("mousemove", (e) => {
        // if(e.key != "j") return;

        if(animating) return;

        let anim;
        if(e.clientX > (innerWidth - 200) && !daytime) {
            anim = [1, 0];
        } else if(e.clientX < 200 && daytime) {
            anim = [0, 1];
        } else { 
          return;
        }

        animating = true;

        let obj = { t: 0 };
        anime({
            targets: obj,
            t: anim,
            complete: () => {
                animating = false;
                daytime = !daytime;
            },
            update: () => {
                sunLight.intensity = 3.5 * (1-obj.t);
                moonLight.intensity = 3.5 * obj.t;

                sunLight.position.setY(20 * (1-obj.t));
                moonLight.position.setY(20 * obj.t);

                sphere.material.sheen = (1 - obj.t);
            
                //------------loop through-------------
                scene.children.forEach((child) => {
                    child.traverse((el) => {
                        if(el instanceof Mesh && el.material.envMap) {
                            el.material.envMapIntensity = el.sunMapIntensity * (1 - obj.t) + el.moonMapIntensity * obj.t
                        }
                    })
                    
                })
                //----------show/hide------------
                sunBG.style.opacity = 1-obj.t;
                moonBG.style.opacity = obj.t;
            },
            easing: "easeInOutSine",
            duration: 500,

        });
    });


    //---------------AnimationLoop-----------------    
    renderer.setAnimationLoop(() => { 
        let delta = clock.getDelta(); //time since last frame

        objectsData.forEach(objectData => {
            let object = objectData.group;

            object.position.set(0,0,0);
            object.rotation.set(0,0,0);
            object.updateMatrixWorld();

            //---------------rotation and movement---------------
            objectData.rot += delta * 0.25;
            object.rotateOnAxis(objectData.randomAxis, objectData.randomAxisRot);
            object.rotateOnAxis(new Vector3(0,1,0), objectData.rot);
            object.rotateOnAxis(new Vector3(0,0,1), objectData.rad);
            object.translateY(objectData.yOff);
            object.rotateOnAxis(new Vector3(1,0,0), +Math.PI * 0.5);
        })
        
        
        controls.update();
        renderer.render(scene, camera);
        //---------------------------OverlayObj Rotation-----------------------------

        overlayObjA.rotation.x = overlayObjA.rotation.x * 0.95 + mousePos.y * 0.05 * 0.425;
        overlayObjA.rotation.y = overlayObjA.rotation.y * 0.95 + mousePos.x * 0.05 * 0.425;

        overlayObjB.rotation.x = overlayObjB.rotation.x * 0.95 + mousePos.y * 0.05 * 0.375;
        overlayObjB.rotation.y = overlayObjB.rotation.y * 0.95 + mousePos.x * 0.05 * 0.375;

        overlayObjC.rotation.x = overlayObjC.rotation.x * 0.95 - mousePos.y * 0.05 * 0.275;
        overlayObjC.rotation.y = overlayObjC.rotation.y * 0.95 - mousePos.x * 0.05 * 0.275;

        sphere.rotation.y += 0.005;
        staticObject.rotation.z += 0.003;
        //-------render overlay----------
        renderer.autoClear = false;
        renderer.render(overlayScene, overlayCamera);
        renderer.autoClear = true;
    });
})();
     


//---------------------function newObject-------------------------------  
function newObject(objectMesh, trailMask, envMap, scene){
    let object = objectMesh.clone();
    object.scale.set(0.5, 0.5, 0.5);
    object.position.set(0,0,0);
    object.rotation.set(0,0,0);
    object.updateMatrixWorld();

     //-------------forLoop for submeshes if any------------------- 
    object.traverse((el) => {
        if(el instanceof Mesh) {
            el.material.envMap = envMap;
            el.castShadow = true;
            el.receiveShadow = true;

            el.sunMapIntensity = 1;
            el.moonMapIntensity = 0.3;
        }
    });
    //------------------trail--------------
    let trail = new Mesh(
        
        new PlaneGeometry(1, 3),
        new MeshPhysicalMaterial({
            envMap,
            envMapIntensity: 1,

            color: new Color(1.0, 0, 0.3),
            roughness: 0.4,
            metalness: 0,
            transmission: 1,

            transparent: true,
            opacity: 1,
            alphaMap: trailMask,
        }) 
    );
    trail.sunMapIntensity = 3;
    trail.moonMapIntensity = 0.7;

    trail.position.set(0,-0.5,0);
    trail.rotateX(Math.PI);
    trail.translateY(1.2);
     


    //------------------add to a group-------------- 
    let group = new Group();
    group.add(object);
    group.add(trail);
    scene.add(group);

    return {
        group, 
        rot: Math.random() * Math.PI * 2.0,
        rad: Math.random() * Math.PI * 0.45 + 0.2,
        yOff: 10.5 + Math.random() * 1.0,
        randomAxis: new Vector3(rnd(), rnd(), rnd()).normalize(),
        randomAxisRot: Math.random() * Math.PI * 2, 
       
    };
}
//--------------------------------
function rnd() {
    return Math.random() * 2 - 1;
}