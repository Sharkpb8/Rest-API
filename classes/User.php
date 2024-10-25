<?php

class User
{
    public int $id;
    public string $username;
    public string $password;

    public function __construct(int $id, string $username, string $password){
        $this->id = $id;
        $this->username = $username;
        $this->password = $password;
    }

    public function setId(int $id): void{
        $this->id = $id;
    }

    public function getId(): int{
        return $this->id;
    }

    public function __toString(): string{
        return $this->username .":". $this->password;
    }
}
