import React, { useContext, useEffect, useRef, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone/esm/vis-network';
// import { DFSgraph } from '../../algorithms/DfsGraph';
import { BinaryTreePreorderTraversal } from '../../algorithms/treeAlgorithms/preorderTraversal';
import { BinaryTreeInorderTraversal } from '../../algorithms/treeAlgorithms/inorderTraversal';
import { dataContext } from '../../context/data-context';
import { BFSgraph } from '../../algorithms/Bfsgraph';
import { Node, Edge } from 'vis-network/standalone/esm/vis-network';
import { Tree } from '../tree/tree';
// import { dfEdge, dfNode, binTreeEdge, ChildDirection } from '../../types/type';
import { dfNode, binTreeEdge } from '../../types/type';
import { ChildDirection } from '../../types/enums';
import TraversalArray from '../../utils/TraversalArray';

export interface VisNetworkProps {
    className?: string;
}
export const Binary_tree = ({ className }: VisNetworkProps) => {
    const { mode, setFinished } = useContext(dataContext);
    const [traversalArray, setTraversalArray]: [any, any] = useState(null);

    let arr_node: dfNode[] = [
        { id: 0, label: '0', is_vis: false, color: 'white', title: '-1' },
        { id: 1, label: '1', is_vis: false, color: 'white', title: '-1' },
        { id: 2, label: '2', is_vis: false, color: 'white', title: '-1' },
        { id: 3, label: '3', is_vis: false, color: 'white', title: '-1' },
        { id: 4, label: '4', is_vis: false, color: 'white', title: '-1' },
        { id: 5, label: '5', is_vis: false, color: 'white', title: '-1' },
        { id: 6, label: '6', is_vis: false, color: 'white', title: '-1' },
        { id: 7, label: '7', is_vis: false, color: 'white', title: '-1' },
        { id: 8, label: '8', is_vis: false, color: 'white', title: '-1' },
        { id: 9, label: '9', is_vis: false, color: 'white', title: '-1' },
    ];

    let arr_edge: binTreeEdge[] = [
        {
            id: 'a',
            from: 0,
            to: 1,
            color: 'white',
            in_tree: false,
            parent: 0,
            childpoint: ChildDirection.LEFT,
        },
        {
            id: 'c',
            from: 0,
            to: 2,
            color: 'white',
            in_tree: false,
            parent: 0,
            childpoint: ChildDirection.RIGHT,
        },
        {
            id: 'd',
            from: 1,
            to: 3,
            color: 'white',
            in_tree: false,
            parent: 1,
            childpoint: ChildDirection.LEFT,
        },
        {
            id: 'b',
            from: 1,
            to: 4,
            color: 'white',
            in_tree: false,
            parent: 1,
            childpoint: ChildDirection.RIGHT,
        },
        {
            id: 'e',
            from: 3,
            to: 7,
            color: 'white',
            in_tree: false,
            parent: 3,
            childpoint: ChildDirection.LEFT,
        },
        {
            id: 'f',
            from: 3,
            to: 8,
            color: 'white',
            in_tree: false,
            parent: 3,
            childpoint: ChildDirection.RIGHT,
        },
        {
            id: 'g',
            from: 2,
            to: 5,
            color: 'white',
            in_tree: false,
            parent: 2,
            childpoint: ChildDirection.LEFT,
        },
        {
            id: 'h',
            from: 2,
            to: 6,
            color: 'white',
            in_tree: false,
            parent: 2,
            childpoint: ChildDirection.RIGHT,
        },
        {
            id: 'i',
            from: 6,
            to: 9,
            color: 'white',
            in_tree: false,
            parent: 6,
            childpoint: ChildDirection.LEFT,
        },
    ];
    let nodes: React.MutableRefObject<DataSet<dfNode, 'id'>> = useRef(new DataSet(arr_node));
    let edges = useRef(new DataSet(arr_edge));
    let options = {
        autoResize: true,
        layout: {
            randomSeed: 10,
            improvedLayout: false,
            clusterThreshold: 10,
            hierarchical: {
                enabled: true,
                levelSeparation: 100,
                nodeSpacing: 100,
                treeSpacing: 200,
                blockShifting: false,
                edgeMinimization: false,
                parentCentralization: true,
                direction: 'UD',
                sortMethod: 'directed',
                shakeTowards: 'roots',
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
                speed: { x: 10, y: 10, zoom: 0.2 },
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
        physics: false,
    };

    // let i = useRef(10);
    let network = useRef<Network | null>(null);
    const visJsRef = useRef<HTMLDivElement>(null);
    const func = () => {
        network.current =
            visJsRef.current &&
            new Network(visJsRef.current, { nodes: nodes.current, edges: edges.current }, options);
        if (network) {
            network.current?.fit({ animation: true, minZoomLevel: 0.7, maxZoomLevel: 1.2 });
        }
    };

    let resetGraph = async () => {
        nodes.current.forEach((_, id) => {
            nodes.current.update({ id: id, color: 'white', is_vis: false, title: '-1' });
        });
        setTraversalArray(nodes.current.get());
        edges.current.forEach((_, id: any) => {
            edges.current.update({ id: id, color: 'white' });
        });
    };

    const preorder = (e: any) => {
        console.log(e);
        setFinished(false);
        let counter = 0;
        let flag = false;
        const Df = new BinaryTreePreorderTraversal(edges.current.get(), nodes.current.get(), 0);

        let inter = setInterval(
            () => {
                console.log(counter);
                console.log(flag);
                flag = false;
                if (Df.complete()) {
                    clearInterval(inter);
                    setFinished(true);
                }
                let x = Df.next();
                if (Df.currnode !== null) {
                    let curr = Df.currnode;
                }

                Df.currnode = x;
                if (x === null) {
                    clearInterval(inter);
                    return;
                }

                if (x?.edgeId === null) {
                    nodes.current.update({ id: x?.node, color: 'orange', title: '0' });
                    setTraversalArray(nodes.current.get());
                    counter++;
                } else {
                    edges.current.update({ id: x?.edgeId, color: 'orange', in_tree: true });
                    let t: any = edges.current.get(x?.edgeId);
                    nodes.current.update({
                        id: x?.node,
                        color: 'orange',
                        title: `${counter}`,
                    });
                    setTraversalArray(nodes.current.get());
                    counter++;
                }
            },
            flag ? 3000 : 1000
        );
    };

    //indorder traversal
    const inorder = (e: any) => {
        console.log(e);
        setFinished(false);
        let counter = 0;
        let flag = false;
        const Df = new BinaryTreeInorderTraversal(edges.current.get(), nodes.current.get(), 0);

        let inter = setInterval(
            () => {
                console.log(counter);
                console.log(flag);
                flag = false;
                if (Df.complete()) {
                    clearInterval(inter);
                    setFinished(true);
                }
                let x = Df.next();
                if (Df.currnode !== null) {
                    let curr = Df.currnode;
                }

                Df.currnode = x;
                if (x === null) {
                    clearInterval(inter);
                    return;
                }

                if (x?.edgeId === null) {
                    nodes.current.update({ id: x?.node, color: 'orange', title: '0' });
                    setTraversalArray(nodes.current.get());
                    counter++;
                } else {
                    edges.current.update({ id: x?.edgeId, color: 'orange', in_tree: true });
                    edges.current.update({ id: x?.edgeId, color: 'orange', in_tree: true });
                    let t: any = edges.current.get(x?.edgeId);
                    nodes.current.update({
                        id: x?.node,
                        color: 'orange',
                        title: `${counter}`,
                    });
                    setTraversalArray(nodes.current.get());
                    counter++;
                }
            },
            flag ? 3000 : 1000
        );
    };

    let funce = async () => {
        network.current?.disableEditMode();
        // network.current?.addE
        network.current?.off('click');
        network.current?.off('selectNode');
        network.current?.unselectAll();
        if (mode === 'preorder') {
            console.log('preorder');
            await resetGraph();
            network.current?.setOptions({ physics: { enabled: true } });
            preorder(network.current);
        }
        if (mode === 'inorder') {
            await resetGraph();
            network.current?.setOptions({ physics: { enabled: true } });
            inorder(network.current);
        }
        if (mode === 'reset') resetGraph();
    };
    useEffect(func, [visJsRef]);
    useEffect(() => {
        funce();
    }, [visJsRef, mode]);
    useEffect(() => {
        console.log(nodes, edges);
    }, [nodes, edges]);
    return (
        <div className="w-full h-full">
            <div className="h-full mx-1 my-3 flex justify-between">
                <TraversalArray traversalArray={traversalArray} />
                <div
                    ref={visJsRef}
                    className="rounded-md overflow-hidden h-full z-3 w-[98%] bg-cyan-800 mx-auto"
                />
                {/* <Tree nodes={nodes} edges={edges} /> */}
            </div>
        </div>
    );
};