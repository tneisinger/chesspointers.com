const metadata = require('./services/node/src/shared/metadata.json');

function makeLink({ title, url }) {
  return `[${title}](${url})`
}

function makeLinks(resources) {
  return resources.map((resource) => makeLink(resource)).join(' || ');
}

function makeChessExpertiseLinks() {
  return makeLinks(metadata.acknowledgements.chessExpertise);
}

function makeSoftwareLinks() {
  return makeLinks(metadata.acknowledgements.software);
}

module.exports = { makeChessExpertiseLinks, makeSoftwareLinks };
