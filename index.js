let result = document.getElementById("calculer");

result.addEventListener('click', function() {
    var inputIPv4 = document.getElementById("ipv4").value;
    var InputSubmask = document.getElementById("submask").value;

    var ipv4Split = inputIPv4.split(".");
    var CIDR = parseInt(InputSubmask);


    if(IsCorrect(ipv4Split,CIDR)) {
        document.getElementById("erreur").innerText = "";
        document.getElementById("netmask").innerText = GetNetMask(CIDR);

        var obj = GetNetworkID(ipv4Split,CIDR);
        document.getElementById("networkID").innerText = obj.NetworkID;
        document.getElementById("hostrange").innerText = obj.FirstNetworkID + " - " + obj.LastNetworkID;
        document.getElementById("broadcast").innerText = obj.BroadCastID;
        document.getElementById("host").innerText = GetNumberHost(CIDR);
        
        // console.log("Netmask : " + GetNetMask(CIDR));
        // console.log("Network ID : " + obj.NetworkID + " First : " + obj.FirstNetworkID + " Broadcast : " + obj.BroadCastID +" Last : " + obj.LastNetworkID);
        // console.log("Nombre d'hôtes : " + GetNumberHost(CIDR));
    } else {
        document.getElementById("erreur").innerText = "Une erreur est survenue ";
    }
})

function BinaryToDecimal(ipAddress){
    return parseInt(ipAddress,2)
}

function DecimalToBinary(ipAddress){
    return ipAddress.toString(2)
}

function IsCorrect (ipAddress, CIDR){
    if(ipAddress.length == 4 && CIDR > 0 && CIDR <= 32){
        return true;
    } else {
        return false;
    }
}

function GetNetMask(CIDR) {
    var submask = [];
    for(i=1;i<=32;i++){
        if(i <= CIDR){
            submask.push("1");
        } else {
            submask.push("0");
        }
        if(i%8 == 0 && i != 32){
            submask.push(".");
        }
    }
    var netMaskSplit = submask.join('').split('.');
    submask = [BinaryToDecimal(netMaskSplit[0]), BinaryToDecimal(netMaskSplit[1]), BinaryToDecimal(netMaskSplit[2]),BinaryToDecimal(netMaskSplit[3])];
    return submask.join('.')
}

function GetNetworkID(ipAddress,CIDR){
    var ipAddressBinary = [];
    for(i=0;i<4;i++){
        ipAddressBinary[i] = DecimalToBinary(parseInt(ipAddress[i]));
        while(ipAddressBinary[i].length != 8){
            ipAddressBinary[i] = "0" + ipAddressBinary[i];
        }
    }
    var ipAddressBinaryString = ipAddressBinary.join('');
    var ipAddressBinarySplit = ipAddressBinaryString.split('');

    for(i=0;i<32;i++){
        if(i >= CIDR) {
            ipAddressBinarySplit[i] = '0';
        }
    }

    for(i=31;i>=1;i--){
        if(i%8 == 0){
            ipAddressBinarySplit.splice(i,0,'.');
        }
    }

    ipAddressBinaryString = ipAddressBinarySplit.join('');
    ipAddressBinarySplit = ipAddressBinaryString.split('.');
    for(i=0;i<4;i++){
        ipAddressBinary[i] = BinaryToDecimal(ipAddressBinarySplit[i]);
    }
    var firstIpAddress = [ipAddressBinary[0],ipAddressBinary[1],ipAddressBinary[2], ipAddressBinary[3]+1];

    var j=3;
    var broadcast = [ipAddressBinary[0],ipAddressBinary[1],ipAddressBinary[2], ipAddressBinary[3]];
    var lastIpAddress = [];

    while(25 >= CIDR){
        CIDR = CIDR + 8;
        j = j-1;
    }
    var lastBits = ipAddressBinary[3]
    if(j == 3){
        broadcast[3] = broadcast[3] + GetNumberHost(CIDR);
        console.log(broadcast[3]);
        lastIpAddress = [broadcast[0],broadcast[1],broadcast[2], broadcast[3] - 1];
    }
    else {
        for(i=0;i<4;i++){
            if(j == i ) {
                broadcast[i] = broadcast[i] + GetHost(CIDR);
            }

            if(j < i){
                broadcast[i] = 255;
            }
            if(i == 3 ){
                lastIpAddress = [broadcast[0],broadcast[1],broadcast[2], broadcast[3] - 1];
            }
        }
    }

    var returnObject = {
        NetworkID : ipAddressBinary.join('.'),
        FirstNetworkID : firstIpAddress.join('.'),
        BroadCastID : broadcast.join('.'),
        LastNetworkID : lastIpAddress.join('.')
    }
    return returnObject;
}

function GetNumberHost(CIDR){
    return (Math.pow(2,(32 - CIDR)))-2
}

function GetHost(CIDR){
    return Math.pow(2,(32 - CIDR))-1
}