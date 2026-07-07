/**
 * Geometry Utility Library for Yoga Pose Validation
 * Handles 2D vector mathematics for angles, distance comparisons, and height comparisons.
 */

/**
 * Calculates the angle (in degrees) between three points.
 * vertex is the middle point (Point B).
 * @param {Object} p1 - Point 1 (e.g. Shoulder)
 * @param {Object} vertex - Point 2 (e.g. Elbow)
 * @param {Object} p2 - Point 3 (e.g. Wrist)
 * @returns {number} Angle in degrees (0 to 180)
 */
export function calculateAngle(p1, vertex, p2) {
  if (!p1 || !vertex || !p2) return 0;
  
  // Vector BA
  const v1 = {
    x: p1.x - vertex.x,
    y: p1.y - vertex.y
  };
  
  // Vector BC
  const v2 = {
    x: p2.x - vertex.x,
    y: p2.y - vertex.y
  };
  
  // Dot product
  const dotProduct = v1.x * v2.x + v1.y * v2.y;
  
  // Magnitudes
  const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
  const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
  
  if (mag1 === 0 || mag2 === 0) return 0;
  
  // Cosine of angle
  let cosTheta = dotProduct / (mag1 * mag2);
  
  // Clamp cosTheta to [-1, 1] to prevent NaN due to rounding issues
  cosTheta = Math.max(-1, Math.min(1, cosTheta));
  
  // Angle in radians
  const angleRad = Math.acos(cosTheta);
  
  // Convert to degrees
  return angleRad * (180 / Math.PI);
}

/**
 * Calculates the Euclidean distance between two points.
 * @param {Object} p1 - Point 1
 * @param {Object} p2 - Point 2
 * @returns {number} Distance
 */
export function calculateDistance(p1, p2) {
  if (!p1 || !p2) return 0;
  return Math.sqrt(
    Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
  );
}

/**
 * Returns a normalization factor based on the user's shoulder width.
 * This ensures that distance checks work regardless of how far the user stands from the camera.
 * @param {Object} landmarks - MediaPipe pose landmarks list
 * @returns {number} Shoulder width distance
 */
export function getShoulderWidth(landmarks) {
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  if (!leftShoulder || !rightShoulder) return 1.0;
  return calculateDistance(leftShoulder, rightShoulder);
}

/**
 * Validates a single posture rule.
 * @param {Object} rule - The rule configuration from config.json
 * @param {Object} landmarks - MediaPipe pose landmarks (index-mapped)
 * @returns {Object} { isValid, isPartiallyValid, message }
 */
export function validateRule(rule, landmarks) {
  const keypointMap = {
    nose: 0,
    left_eye: 2,
    right_eye: 5,
    left_shoulder: 11,
    right_shoulder: 12,
    left_elbow: 13,
    right_elbow: 14,
    left_wrist: 15,
    right_wrist: 16,
    left_hip: 23,
    right_hip: 24,
    left_knee: 25,
    right_knee: 26,
    left_ankle: 27,
    right_ankle: 28,
  };

  const getPt = (label) => landmarks[keypointMap[label]];

  if (rule.type === 'angle') {
    const p1 = getPt(rule.keypoints[0]);
    const vertex = getPt(rule.keypoints[1]);
    const p2 = getPt(rule.keypoints[2]);

    if (!p1 || !vertex || !p2) {
      return { isValid: false, isPartiallyValid: false, message: 'Body parts not fully visible' };
    }

    const angle = calculateAngle(p1, vertex, p2);
    const target = rule.target_angle;
    const tol = rule.tolerance_deg;

    const diff = Math.abs(angle - target);
    if (diff <= tol) {
      return { isValid: true, isPartiallyValid: true, message: '' };
    }
    
    // Partially valid: knee or elbow is bending in the correct direction but has limited flexibility (double tolerance allowed)
    if (diff <= tol * 2.2) {
      return { 
        isValid: false, 
        isPartiallyValid: true, 
        message: angle < target ? rule.fail_straight_msg : rule.fail_overbend_msg 
      };
    }

    return { 
      isValid: false, 
      isPartiallyValid: false, 
      message: angle < target ? rule.fail_straight_msg : rule.fail_overbend_msg 
    };
  }

  if (rule.type === 'height_compare') {
    const src = getPt(rule.source_keypoint);
    const ref = getPt(rule.reference_keypoint);

    if (!src || !ref) {
      return { isValid: false, isPartiallyValid: false, message: 'Body parts not fully visible' };
    }

    // Remember: screen y-axis is inverted (0 is top, 1 is bottom)
    const isAbove = src.y < ref.y;
    
    if (rule.relation === 'above') {
      if (isAbove) {
        return { isValid: true, isPartiallyValid: true, message: '' };
      }
      
      // Partially valid: close to the height boundary (within 15% shoulder width)
      const shoulderWidth = getShoulderWidth(landmarks);
      const closeMargin = Math.abs(src.y - ref.y) < (shoulderWidth * 0.4);
      if (closeMargin) {
        return { isValid: false, isPartiallyValid: true, message: rule.fail_msg };
      }
      
      return { isValid: false, isPartiallyValid: false, message: rule.fail_msg };
    }
    
    if (rule.relation === 'below') {
      if (!isAbove) {
        return { isValid: true, isPartiallyValid: true, message: '' };
      }
      return { isValid: false, isPartiallyValid: false, message: rule.fail_msg };
    }
  }

  if (rule.type === 'distance_compare') {
    const p1 = getPt(rule.keypoints[0]);
    const p2 = getPt(rule.keypoints[1]);

    if (!p1 || !p2) {
      return { isValid: false, isPartiallyValid: false, message: 'Body parts not fully visible' };
    }

    const distance = calculateDistance(p1, p2);
    const shoulderWidth = getShoulderWidth(landmarks);
    const maxAllowedDist = shoulderWidth * rule.max_distance_factor;

    if (rule.relation === 'close') {
      if (distance <= maxAllowedDist) {
        return { isValid: true, isPartiallyValid: true, message: '' };
      }
      
      // Partially valid: within 2.5x of the target close distance
      if (distance <= maxAllowedDist * 2.5) {
        return { isValid: false, isPartiallyValid: true, message: rule.fail_msg };
      }
      
      return { isValid: false, isPartiallyValid: false, message: rule.fail_msg };
    }
  }

  return { isValid: true, isPartiallyValid: true, message: '' };
}
