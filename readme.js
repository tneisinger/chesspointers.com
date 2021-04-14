const youtubeChannels =
  require('./services/node/src/shared/youtubeAcknowledgements.json');
const softwarePackages =
  require('./services/node/src/shared/softwareAcknowledgements.json');

function makeLink({ title, url }) {
  return `[${title}](${url})`
}

function makeLinks(resources) {
  return resources.map((resource) => makeLink(resource)).join(' || ');
}

function makeYoutubeLinks() {
  return makeLinks(youtubeChannels);
}

function makeSoftwareLinks() {
  return makeLinks(softwarePackages);
}

module.exports = { makeYoutubeLinks, makeSoftwareLinks };
