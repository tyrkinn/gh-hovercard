import type { PlasmoMessaging } from '@plasmohq/messaging'


const handler: PlasmoMessaging.MessageHandler = async (req, res) => {

  const repo = req.body.repo;


  const hovercard = await fetch(`https://github.com/${repo}/hovercard`, {
    "headers": {
      "accept": "*/*",
      "accept-language": "en-US,en;q=0.9,ru;q=0.8",
      "x-requested-with": "XMLHttpRequest",
      "Referer": "https://github.com/dashboard",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": null,
    "method": "GET"
  });
  const message = await hovercard.text()

  res.send({
    message
  })
}


export default handler;
