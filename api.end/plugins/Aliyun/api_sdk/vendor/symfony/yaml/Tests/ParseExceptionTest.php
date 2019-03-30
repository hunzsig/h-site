<?php
 namespace Symfony\Component\Yaml\Tests; use PHPUnit\Framework\TestCase; use Symfony\Component\Yaml\Exception\ParseException; class ParseExceptionTest extends TestCase { public function testGetMessage() { $exception = new ParseException('Error message', 42, 'foo: bar', '/var/www/app/config.yml'); $message = 'Error message in "/var/www/app/config.yml" at line 42 (near "foo: bar")'; $this->assertEquals($message, $exception->getMessage()); } public function testGetMessageWithUnicodeInFilename() { $exception = new ParseException('Error message', 42, 'foo: bar', 'äöü.yml'); $message = 'Error message in "äöü.yml" at line 42 (near "foo: bar")'; $this->assertEquals($message, $exception->getMessage()); } } 