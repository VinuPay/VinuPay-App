import React from 'react';
import ItemDrawer from "../components/sidebar";
import VinuSad from '../assets/vinusad.png';

export default function NotFoundTab() {
    return (
        <div>
            <ItemDrawer />
            <img src={VinuSad} alt="vinusad" style={{height: 200}}/>
            <h1>Nope. That's not a page, fellow explorer.</h1>
            <h2>Use the sidebar to get back home!</h2>
        </div>
    );
}
