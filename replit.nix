{ pkgs }: {
    deps = [
        pkgs.nodejs-18_x
        pkgs.nodePackages.vite
        pkgs.yarn
        pkgs.replitPackages.jest
    ];
}