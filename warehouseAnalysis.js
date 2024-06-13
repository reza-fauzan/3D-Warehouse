// Styling
$(`#${idElm}`).append(`
    <style>
        #${idElm} #containerId{
            position: absolute;
            right: 3em;
            bottom: 2em;
        }
        #${idElm} .product-info {
            position: absolute;
            left: 3em;
            top: 1em;
            background: rgba(255, 255, 255, 0.8);
            padding: 1em;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        #${idElm}  #buttonsContainer {
            position: absolute;
            bottom: 10px;
            right: 10px;
            z-index: -1;
            display: flex;
            gap: 10px;
        }
        
        #${idElm} .rotate-button {
            background-color: #007BFF;
            color: #fff;
            border: 2px solid #0056b3;
            padding: 6px 14px;
            font-size: 12px;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease, transform 0.2s ease;
        }
        
        #${idElm} .rotate-button:hover {
            background-color: #0056b3;
            transform: scale(1.05);
        }
        
        #${idElm} .rotate-button:active {
            background-color: #004494;
        }
    </style>
`);

$(`#${idElm}`).append(`
    <div id="productInfo" class="product-info">
        <h3 id="productName"></h3>
        <p><span>Quantity:</span> <span id="productQty"></span></p>
        <p><span>UOM:</span> <span id="productUom"></span></p>
        <p><span>Lot Number:</span> <span id="productLotNumber"></span></p>
        <p><span>Stock Movement:</span> <span id="productStockMovement"></span></p>
        <p><span>Stock Status:</span> <span id="productStockStatus"></span></p>
        <p><span>Expired Date:</span> <span id="productExpiredDate"></span></p>
    </div>
`);

var metaCharset = document.createElement('meta');
metaCharset.setAttribute('charset', 'UTF-8');

var metaViewport = document.createElement('meta');
metaViewport.setAttribute('name', 'viewport');
metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');

document.head.appendChild(metaCharset);
document.head.appendChild(metaViewport);

var s_import = document.createElement('script');
s_import.setAttribute('type', 'importmap');
s_import.innerHTML = `
    {
        "imports": {
            "three": "https://unpkg.com/three@0.140.0/build/three.module.js",
            "controls": "https://unpkg.com/three@0.140.0/examples/jsm/controls/OrbitControls.js"
        }
    }
`;

var s = document.createElement('script');
s.setAttribute('type', 'module');
s.innerHTML = `

import * as THREE from 'three';
import { OrbitControls } from 'controls';

const containerId = '${idElm}';
const container = document.getElementById(containerId);

if (container) {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 500);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    const cubeData = {
        'R1S1B1': {
            'product': 'Product A',
            'qty': 100,
            'uom': 'pcs',
            'lot_number': 'LOT/001',
            'stock_movement': 'fast',
            'stock_status': 'near_expired',
            'expired_date': '2025-01-01'
        },
        'R1S1B2': {
            'product': 'Product B',
            'qty': 50,
            'uom': 'pcs',
            'lot_number': 'LOT/002',
            'stock_movement': 'slow',
            'stock_status': 'expired',
            'expired_date': '2023-01-01'
        },
        'R2S1B2': {
            'product': 'Product C',
            'qty': 150,
            'uom': 'pcs',
            'lot_number': 'LOT/002',
            'stock_movement': 'medium',
            'stock_status': 'good_stock',
            'expired_date': '2028-01-01'
        }
    };

    const cubes = [];
    let racks = [];

    const gap = 0.2;
    let totalCubesX = 3;
    let totalCubesY = 3;
    let totalCubesZ = 10;
    const zGap = 2.5;

    const initialCameraPosition = new THREE.Vector3(22, 9, 18);
    camera.position.copy(initialCameraPosition);

    function resizeCanvas() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function createCube(geometry, material, position, name, data) {
        const cube = new THREE.Mesh(geometry, material);
        cube.position.copy(position);
        cube.name = name;
        cube.data = data;
        scene.add(cube);
        cubes.push(cube);
    }

    function createRack(position, isTopRow, formatRack) {
        const rack = new THREE.Group();

        const rackMaterial = new THREE.MeshStandardMaterial({ color: 0xAAAAAA, metalness: 0.1 });
        const rackGeometry = new THREE.BoxGeometry(2.2, 0.1, 1.2);
        const bottomRack = new THREE.Mesh(rackGeometry, rackMaterial);
        bottomRack.position.set(0, 0.03, 0);
        rack.add(bottomRack);

        if (isTopRow) {
            const coverMaterial = new THREE.MeshStandardMaterial({ color: 0xAAAAAA, metalness: 0.1 });
            const coverGeometry = new THREE.BoxGeometry(2.2, 0.1, 1.2);
            const cover = new THREE.Mesh(coverGeometry, coverMaterial);
            cover.position.set(0, 1.16, 0);
            rack.add(cover);
        }

        scene.add(rack);
        rack.position.copy(position);

        racks.push(formatRack);
    }

    for (let x = 0; x < totalCubesX; x++) {
        for (let y = 0; y < totalCubesY; y++) {
            for (let z = 0; z < totalCubesZ; z++) {
                const geometry = new THREE.BoxGeometry(1.7, 1, 1);
                const material = new THREE.MeshBasicMaterial({ color: 0x0E95FE, opacity: 0.5, transparent: true });

                const positionX = x * (2 + gap) - 4;
                const positionY = y * (1 + gap);
                const positionZ = z * (1 + gap) + Math.floor(z / 2) * zGap;

                const position = new THREE.Vector3(positionX, positionY, positionZ);

                const name = \`R\${x + 1}S\${y + 1}B\${z + 1}\`;

                let data = undefined;
                if (name in cubeData) {
                    data = cubeData[name];
                }

                createCube(geometry, material, position, name, data);

                const rackPosition = new THREE.Vector3(position.x, position.y - 0.6, position.z);
                const formatRack = \`R\${x + 1}S\${y + 1}B\${z + 1}\`;
                const isTopRow = y === totalCubesY - 1;

                createRack(rackPosition, isTopRow, formatRack);
            }
        }
    }

    console.log("Racks:", racks);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);

    const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    scene.add(hemisphereLight);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredObject = null;

    function animateCameraToTarget(target, duration) {
        const initialPosition = new THREE.Vector3().copy(camera.position);
        const targetPosition = new THREE.Vector3().copy(target);

        let startTime = null;

        function animate(timestamp) {
            if (!startTime) {
                startTime = timestamp;
            }

            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const newPosition = initialPosition.clone().lerp(targetPosition, progress);
            camera.position.copy(newPosition);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }

        requestAnimationFrame(animate);
    }

    function setCameraToCenter() {
        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

        cubes.forEach(cube => {
            minX = Math.min(minX, cube.position.x);
            minY = Math.min(minY, cube.position.y);
            minZ = Math.min(minZ, cube.position.z);
            maxX = Math.max(maxX, cube.position.x);
            maxY = Math.max(maxY, cube.position.y);
            maxZ = Math.max(maxZ, cube.position.z);
        });

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const centerZ = (minZ + maxZ) / 2;

        controls.target.set(centerX, centerY, centerZ);
        controls.update();
    }

    setCameraToCenter();

    function showProductInfo(data) {
        const productName = document.getElementById('productName');
        const productQty = document.getElementById('productQty');
        const productUom = document.getElementById('productUom');
        const productLotNumber = document.getElementById('productLotNumber');
        const productStockMovement = document.getElementById('productStockMovement');
        const productStockStatus = document.getElementById('productStockStatus');
        const productExpiredDate = document.getElementById('productExpiredDate');

        productName.textContent = data.product || '';
        productQty.textContent = data.qty || '';
        productUom.textContent = data.uom || '';
        productLotNumber.textContent = data.lot_number || '';
        productStockMovement.textContent = data.stock_movement || '';
        productStockStatus.textContent = data.stock_status || '';
        productExpiredDate.textContent = data.expired_date || '';
    }

    let previousCube = null;

    function handleClick(event) {
        const rect = container.getBoundingClientRect();

        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(cubes);

        if (intersects.length > 0) {
            const selectedCube = intersects[0].object;

            if (previousCube && previousCube !== selectedCube) {
                previousCube.material = new THREE.MeshBasicMaterial({ color: 0x0E95FE, opacity: 0.5, transparent: true });
            }

            selectedCube.material = new THREE.MeshBasicMaterial({ color: 0x0E95FE });

            const target = new THREE.Vector3().copy(selectedCube.position);
            target.y += 0.5;
            target.x += 3;
            target.z += 1.5;
            animateCameraToTarget(target, 500);

            controls.target.copy(selectedCube.position);

            if (selectedCube.data) {
                showProductInfo(selectedCube.data);
            } else {
                showProductInfo({});
            }

            previousCube = selectedCube;
        }
    }

    renderer.domElement.addEventListener('click', handleClick);

    function rotateCamera(angle) {
        const radius = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);
        const currentAngle = Math.atan2(camera.position.z, camera.position.x);
        const newAngle = currentAngle + angle;
        camera.position.x = radius * Math.cos(newAngle);
        camera.position.z = radius * Math.sin(newAngle);
        controls.update();
    }

    function addButtons() {
        
        const buttonsContainer = document.createElement('div');
        buttonsContainer.id = 'buttonsContainer';
        buttonsContainer.style.position = 'absolute';
        buttonsContainer.style.bottom = '10px';
        buttonsContainer.style.right = '10px';
        buttonsContainer.style.zIndex = '1000';
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.gap = '10px';

        const buttonClockwise = document.createElement('button');
        buttonClockwise.classList.add('rotate-button');
        buttonClockwise.textContent = 'Right';
        buttonClockwise.onclick = () => rotateCamera(-Math.PI / 8);

        const buttonAntiClockwise = document.createElement('button');
        buttonAntiClockwise.classList.add('rotate-button');
        buttonAntiClockwise.textContent = 'Left';
        buttonAntiClockwise.onclick = () => rotateCamera(Math.PI / 8);

        const buttonCenter = document.createElement('button');
        buttonCenter.classList.add('rotate-button');
        buttonCenter.textContent = 'Center';
        buttonCenter.onclick = () => {
            camera.position.copy(initialCameraPosition);
            setCameraToCenter();
            controls.update();
        };

        buttonsContainer.appendChild(buttonClockwise);
        buttonsContainer.appendChild(buttonAntiClockwise);
        buttonsContainer.appendChild(buttonCenter);

        container.appendChild(buttonsContainer);
    }

    addButtons();

    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}
`;

$.when(
    document.getElementById(idElm).appendChild(s_import),
    document.getElementById(idElm).appendChild(s),
    $.Deferred(function (deferred) {
        $(deferred.resolve);
    })
).done(function () {
});
