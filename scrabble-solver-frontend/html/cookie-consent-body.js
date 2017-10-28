const html = '<script>window.addEventListener("load",function(){window.cookieconsent.initialise({palette:{popup:{background:"#333"},button:{background:"#14a7d0"}},position:"bottom-right"})});</script>';

module.exports = process.env.NODE_ENV === 'production' ? html : '';
