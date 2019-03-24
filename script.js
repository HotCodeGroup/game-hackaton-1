if (p_up < b_down) {
        let inter =
            intersection(p_left, p_up, p_right, p_up, b_left, b_down, b_left + bRelVx, b_down + bRelVy) ||
            intersection(p_left, p_up, p_right, p_up, b_right, b_down, b_right + bRelVx, b_down + bRelVy);
        if (inter) {
            let to_ratio = bRelVy / (b_down - p_up);
            let out_ratio = 1 - to_ratio;
            b.y += to_ratio * b.vY - out_ratio * b.vY;
            b.x += b.vX;
            b.vY = - b.vY;
        }
    }

    if (p_down > b_up) {
        let inter =
            intersection(p_left, p_down, p_right, p_down, b_left, b_up, b_left + bRelVx, b_up + bRelVy) ||
            intersection(p_left, p_down, p_right, p_down, b_right, b_up, b_right + bRelVx, b_up + bRelVy);
        if (inter) {
            let to_ratio = bRelVy / (b_down - p_up);
            let out_ratio = 1 - to_ratio;
            b.y += to_ratio * b.vY - out_ratio * b.vY;
            b.x += b.vX;
            b.vY = - b.vY;
        }
    }