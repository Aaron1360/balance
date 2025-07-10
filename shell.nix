{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  name = "balance-dev-shell";
  buildInputs = [
    pkgs.nodejs_24      # Node.js for backend and frontend (Vite, React)
    pkgs.sqlite         # SQLite for the database
  ];

  shellHook = ''
    echo "Welcome to the Balance development shell!"
    echo "Node version: $(node --version)"
    echo "SQLite version: $(sqlite3 --version)"
  '';
}