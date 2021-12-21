#! /bin/bash

if [[ $(command -v brew) ]]; then
    echo "🍺 Homebrew already installed"
else
    if [[ "$OSTYPE" == "darwin"* ]]; then
        /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
    else
        test -d ~/.linuxbrew && eval "$(~/.linuxbrew/bin/brew shellenv)"
        test -d /home/linuxbrew/.linuxbrew && eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
        test -r ~/.bash_profile && echo "eval \"\$($(brew --prefix)/bin/brew shellenv)\"" >>~/.bash_profile
        echo "eval \"\$($(brew --prefix)/bin/brew shellenv)\"" >>~/.profile
    fi
fi

if [[ $(command -v pip3) ]]; then
    echo "Pip already installed"
else
    brew install pip3
fi
pip3 install numpy 

if [[ $(command -v node) ]]; then
    echo "Node already installed"
else
    brew install node
fi

cd sources/web/Node-app
npm install body-parser cors express express-fileupload formidable fs lodash morgan
node index.js
