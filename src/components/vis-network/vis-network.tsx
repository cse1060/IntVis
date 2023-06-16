import styles from './vis-network.module.scss';
import classNames from 'classnames';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
import { DFSgraph } from '../../algorithms/DfsGraph';
import { dataContext } from '../../context/data-context';
import { BFSgraph } from '../../algorithms/Bfsgraph';
export interface VisNetworkProps {
    className?: string;
}
export const VisNetwork = ({ className }: VisNetworkProps) => {
    const {mode,setMode}=useContext(dataContext)
    let arr_node:any[] = [
        { id: 0, label: '0', is_vis: false, color: 'white' },
        { id: 1, label: '1', is_vis: false, color: 'white' },
        { id: 2, label: '2', is_vis: false, color: 'white' },
        { id: 3, label: '3', is_vis: false, color: 'white' },
        { id: 4, label: '4', is_vis: false, color: 'white' },
        { id: 5, label: '5', is_vis: false, color: 'white' },
        { id: 6, label: '6', is_vis: false, color: 'white' },
        { id: 7, label: '7', is_vis: false, color: 'white' },
        { id: 8, label: '8', is_vis: false, color: 'white' },
        { id: 9, label: '9', is_vis: false, color: 'white' },
    ];

    let arr_edge = [
        { id: 'a', from: 0, to: 2 },
        { id: 'b', from: 0, to: 1 },
        { id: 'c', from: 1, to: 3 },
        { id: 'd', from: 1, to: 4 },
        { id: 'e', from: 1, to: 5 },
        { id: 'f', from: 2, to: 6 },
        { id: 'g', from: 2, to: 7 },
        { id: 'h', from: 7, to: 0 },
        { id: 'i', from: 7, to: 9 },
        { id: 'j', from: 4, to: 8 },
    ];
    let nodes = useRef(new DataSet(arr_node));
    let edges = useRef(new DataSet(arr_edge));
    let options = {
        autoResize: true,
        layout: {
            randomSeed: 10,
            improvedLayout: false,
            clusterThreshold: 10,
            hierarchical: {
                enabled: false,
                levelSeparation: 200,
                nodeSpacing: 100,
                treeSpacing: 200,
                blockShifting: true,
                edgeMinimization: true,
                parentCentralization: true,
                direction: 'UD',
                sortMethod: 'directed',
                shakeTowards: 'leaves',
            },
        },
        edges: {
            arrows: {
                to: {
                    enabled: true,
                    type: 'arrow',
                },
            },
        },
        interaction: {
            dragNodes: true,
            dragView: true,
            hideEdgesOnDrag: false,
            hideEdgesOnZoom: false,
            hideNodesOnDrag: false,
            hover: true,
            hoverConnectedEdges: true,
            keyboard: {
                enabled: false,
                speed: { x: 10, y: 10, zoom: 0.02 },
                bindToWindow: true,
                autoFocus: true,
            },
            multiselect: false,
            navigationButtons: false,
            selectable: true,
            selectConnectedEdges: true,
            tooltipDelay: 300,
            zoomSpeed: 1,
            zoomView: true,
        },
        physics: {
            enabled: true,
            solver: 'forceAtlas2Based',
            forceAtlas2Based: {
                springLength: 20,
                springConstant: 0.2,
                damping: 0.9,
                centralGravity: 0.01,
            },
        },
        manipulation: {
            enabled: true,
            initiallyActive: true,
            addNode: false,
            addEdge: true,
            editNode: undefined,
            editEdge: true,
            deleteNode: true, 
            deleteEdge: true,
            controlNodeStyle: {
                // all node options are valid.
            },
        },
    };
    let i= useRef(10)
    let network=useRef<Network|null>(null)
    const visJsRef = useRef<HTMLDivElement>(null);
    const func = () => {
        // let [network,setnetwork]=useState(visJsRef.current && new Network(visJsRef.current, { nodes, edges }, options);)
        network.current = visJsRef.current && new Network(visJsRef.current, { nodes:nodes.current, edges:edges.current }, options);
        if (network) {
            network.current?.fit({ animation: true, minZoomLevel: 0.1, maxZoomLevel: 0.25 });
        }
        network.current?.setSize(window.innerWidth.toString() + 'px', window.innerHeight.toString() + 'px');
       
    };
    const addfn=(e:any)=>{
        
        console.log(e);
        let se_node={id:i.current,label:`${i.current}`,is_vis:false,color:'white',x:e['pointer']['canvas'].x,y:e['pointer']['canvas'].y}
        nodes.current.add(se_node)
        arr_node.push(se_node)
        i.current+=1;
    }
    // const selectNodefn=(e:any)=>{
    //      const Df = new BFSgraph(edges.current.get(), nodes.current.get(), e['nodes'][0]);
    // let inter=setInterval(()=>{
    //     let x=Df.next();
    //     nodes.current.update({ id: x, color: 'orange' })
    //     if(Df.complete()){
    //         clearInterval(inter)
    //     }
    // },1000)
    // }
    const startDFS=(e:any)=>{
         const Df = new DFSgraph(edges.current.get(), nodes.current.get(), e['nodes'][0]);
    let inter=setInterval(()=>{
        let x=Df.next();
        nodes.current.update({ id: x, color: 'orange' })
        if(Df.complete()){
            clearInterval(inter)
        }
    },1000)
    }
    const startBFS=(e:any)=>{
         const Df = new BFSgraph(edges.current.get(), nodes.current.get(), e['nodes'][0]);
    let inter=setInterval(()=>{
        let x=Df.next();
        nodes.current.update({ id: x, color: 'black' })
        if(Df.complete()){
            clearInterval(inter)
        }
    },1000)
    }

    const resetGraph=()=>{

    }
    let funce=()=>{
        network.current?.disableEditMode()
        if(mode==="start"){
            network.current?.off('click');
            // network.current?.on("selectNode",selectNodefn);
        }
        if(mode==="add"){
            network.current?.off('selectNode');
            network.current?.on("click",addfn);
        }
        if(mode==="edge"){
            network.current?.addEdgeMode();
        }
        if(mode=="DFS")
        {
            network.current?.off('click');
            network.current?.on("selectNode",startDFS);
        }
        if(mode=="BFS")
        {
            network.current?.off('click');
            network.current?.on("selectNode",startBFS);
        }
    }
    useEffect(func, [visJsRef]);
    useEffect(funce,[visJsRef,mode])
    return (
        <div id="container">
            <div ref={visJsRef} className={styles['Network']} />
        </div>
    );
};

