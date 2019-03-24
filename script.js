if (p_left < b_right) {
    let inter =
        intersection(p_down, p_left, p_up, p_left, b_down, b_right, b_down + bRelVy, b_right + bRelVx) ||
        intersection(p_down, p_left, p_up, p_left, b_up, b_right, b_up + bRelVy, b_right + bRelVx);
    if (inter) {
        let to_ratio = bRelVx / (b_right - p_left);
        let out_ratio = 1 - to_ratio;
        b.x += to_ratio * b.vX - out_ratio * b.vX;
        b.y += b.vY;
        b.vX = - b.vX;
    }
}