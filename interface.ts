/* 
 * Copyright (C) 2018 Qli5. All Rights Reserved.
 * 
 * @author qli5 <goodlq11[at](163|gmail).com>
 * 
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import parser, { Danmaku } from './extension/danmaku/parser.js';
import genLayout from './extension/danmaku/layout.js';
import assembleASS from './extension/danmaku/ass.js';
import { normalize } from './extension/options/ext_options.js';
import { convertToBlob } from './extension/download/download.js';

export interface ASSConverterInit {
    title?: string
    originalURL?: string

    /**
     * canvas width for drawing danmaku (px)
     */
    resolutionX?: number
    /**
     * canvas height for drawing danmaku (px)
     */
    resolutionY?: number
    /**
     * reserved height at bottom for drawing danmaku (px)
     */
    bottomReserved?: number
    /**
     * danmaku font family
     */
    fontFamily?: string
    /**
     * danmaku font size (ratio)
     */
    fontSize?: number
    /**
     * space between danmaku (px)
     */
    textSpace?: number
    /**
     * duration of right to left moving danmaku appeared on screen (s)
     */
    rtlDuration?: number
    /**
     * duration of keep bottom / top danmaku appeared on screen (s)
     */
    fixDuration?: number
    /**
     * maxinum amount of allowed delay (s)
     */
    maxDelay?: number
    /**
     * opacity of text, in range of [0, 1]
     */
    textOpacity?: number
    /**
     * maxinum layers of danmaku
     */
    maxOverlap?: number
}

const parseXML = (xml: string) => parser.bilibili(xml).danmaku;

const genASS = async (danmaku: Danmaku[], option = {} as ASSConverterInit) => {
    option = normalize(option);
    const layout = await genLayout(danmaku, option);
    const ass = assembleASS({
        content: danmaku,
        layout,
        meta: {
            name: option && option.title || 'danmaku',
            url: option && option.originalURL || 'anonymous xml',
        }
    }, option);
    return ass;
}

const genASSBlob = async (danmaku: Danmaku[], option = {} as ASSConverterInit) => convertToBlob(await genASS(danmaku, option));

export { parseXML, genASS, genASSBlob };
export default { parseXML, genASS, genASSBlob };
