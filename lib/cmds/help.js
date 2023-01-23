const main = {
  config: {
    description: "帮助",
    isSimpleCommand: true
  },
  
  default: {
    description: "帮助",
    help: "!!help",
    cmd: helpCmd
  }
};

async function helpCmd(msg) {
  let content = "帮助：";
  let cmds = Object.keys(Command);
  for (let value of cmds) {
    if(value === "debug") continue;
    let isSimple = Command[value].main.config.isSimpleCommand;
    if(isSimple) {
      content = content + "\n\n" + Command[value].main.default.help + "\n说明：" + Command[value].main.default.description;
      continue;
    }
    let subs = Object.keys(Command[value].main.sub);
    for (let subValue of subs) {
      content = content + "\n\n" + Command[value].main.sub[subValue].help + "\n说明：" + Command[value].main.sub[subValue].description;
    }
  }
  msg.reply(content);
}

export { main }