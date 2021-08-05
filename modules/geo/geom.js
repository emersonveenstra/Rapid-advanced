
import { geomLineIntersection} from '@id-sdk/geom';

import {
    geoVecAngle, geoVecDot, geoVecEqual, geoVecLength, geoVecSubtract
} from './vector.js';


// Return the counterclockwise angle in the range (-pi, pi)
// between the positive X axis and the line intersecting a and b.
export function geoAngle(a, b, projection) {
    return geoVecAngle(projection(a.loc), projection(b.loc));
}


// Choose the edge with the minimal distance from `point` to its orthogonal
// projection onto that edge, if such a projection exists, or the distance to
// the closest vertex on that edge. Returns an object with the `index` of the
// chosen edge, the chosen `loc` on that edge, and the `distance` to to it.
export function geoChooseEdge(nodes, point, projection, activeID) {
    var dist = geoVecLength;
    var points = nodes.map(function(n) { return projection(n.loc); });
    var ids = nodes.map(function(n) { return n.id; });
    var min = Infinity;
    var idx;
    var loc;

    for (var i = 0; i < points.length - 1; i++) {
        if (ids[i] === activeID || ids[i + 1] === activeID) continue;

        var o = points[i];
        var s = geoVecSubtract(points[i + 1], o);
        var v = geoVecSubtract(point, o);
        var proj = geoVecDot(v, s) / geoVecDot(s, s);
        var p;

        if (proj < 0) {
            p = o;
        } else if (proj > 1) {
            p = points[i + 1];
        } else {
            p = [o[0] + proj * s[0], o[1] + proj * s[1]];
        }

        var d = dist(p, point);
        if (d < min) {
            min = d;
            idx = i + 1;
            loc = projection.invert(p);
        }
    }

    if (idx !== undefined) {
        return { index: idx, distance: min, loc: loc };
    } else {
        return null;
    }
}


// Test active (dragged or drawing) segments against inactive segments
// This is used to test e.g. multipolygon rings that cross
// `activeNodes` is the ring containing the activeID being dragged.
// `inactiveNodes` is the other ring to test against
export function geoHasLineIntersections(activeNodes, inactiveNodes, activeID) {
    var actives = [];
    var inactives = [];
    var j, k, n1, n2, segment;

    // gather active segments (only segments in activeNodes that contain the activeID)
    for (j = 0; j < activeNodes.length - 1; j++) {
        n1 = activeNodes[j];
        n2 = activeNodes[j+1];
        segment = [n1.loc, n2.loc];
        if (n1.id === activeID || n2.id === activeID) {
            actives.push(segment);
        }
    }

    // gather inactive segments
    for (j = 0; j < inactiveNodes.length - 1; j++) {
        n1 = inactiveNodes[j];
        n2 = inactiveNodes[j+1];
        segment = [n1.loc, n2.loc];
        inactives.push(segment);
    }

    // test
    for (j = 0; j < actives.length; j++) {
        for (k = 0; k < inactives.length; k++) {
            var p = actives[j];
            var q = inactives[k];
            var hit = geomLineIntersection(p, q);
            if (hit) {
                return true;
            }
        }
    }

    return false;
}


// Test active (dragged or drawing) segments against inactive segments
// This is used to test whether a way intersects with itself.
export function geoHasSelfIntersections(nodes, activeID) {
    var actives = [];
    var inactives = [];
    var j, k;

    // group active and passive segments along the nodes
    for (j = 0; j < nodes.length - 1; j++) {
        var n1 = nodes[j];
        var n2 = nodes[j+1];
        var segment = [n1.loc, n2.loc];
        if (n1.id === activeID || n2.id === activeID) {
            actives.push(segment);
        } else {
            inactives.push(segment);
        }
    }

    // test
    for (j = 0; j < actives.length; j++) {
        for (k = 0; k < inactives.length; k++) {
            var p = actives[j];
            var q = inactives[k];
            // skip if segments share an endpoint
            if (geoVecEqual(p[1], q[0]) || geoVecEqual(p[0], q[1]) ||
                geoVecEqual(p[0], q[0]) || geoVecEqual(p[1], q[1]) ) {
                continue;
            }

            var hit = geomLineIntersection(p, q);
            if (hit) {
                var epsilon = 1e-8;
                // skip if the hit is at the segment's endpoint
                if (geoVecEqual(p[1], hit, epsilon) || geoVecEqual(p[0], hit, epsilon) ||
                    geoVecEqual(q[1], hit, epsilon) || geoVecEqual(q[0], hit, epsilon) ) {
                    continue;
                } else {
                    return true;
                }
            }
        }
    }

    return false;
}