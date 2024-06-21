import React from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Search from './Search'

const Main = (props) => {
    return (
        <HelmetProvider>
            <Helmet
                titleTemplate="%s | 음식추천유튜브"
                defaultTitle="오늘은머먹지?"
                defer={false}
            >
                {props.title && <title>{props.title}</title>}
                <meta name="description" content={props.description} />
            </Helmet>

            <main id="main" role="main">
                <Search />
                {props.children}
            </main>
        </HelmetProvider>
    )
}

export default Main