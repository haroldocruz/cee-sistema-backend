

module.exports = () => {
    // for (const path in require.cache) {
    //     if (path.endsWith('.js')) { // only clear *.js, not *.node
    //       delete require.cache[path]
    //     }
    //   }
    delete require.cache[require.resolve('./controller.js')]
    delete require.cache[require.resolve('./index.js')]
    delete require.cache[require.resolve('./model.js')]
    delete require.cache[require.resolve('./router.js')]
}