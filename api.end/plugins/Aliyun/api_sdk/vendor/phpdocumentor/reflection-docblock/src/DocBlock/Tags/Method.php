<?php
 namespace phpDocumentor\Reflection\DocBlock\Tags; use phpDocumentor\Reflection\DocBlock\Description; use phpDocumentor\Reflection\DocBlock\DescriptionFactory; use phpDocumentor\Reflection\Type; use phpDocumentor\Reflection\TypeResolver; use phpDocumentor\Reflection\Types\Context as TypeContext; use phpDocumentor\Reflection\Types\Void_; use Webmozart\Assert\Assert; final class Method extends BaseTag implements Factory\StaticMethod { protected $name = 'method'; private $methodName = ''; private $arguments = []; private $isStatic = false; private $returnType; public function __construct( $methodName, array $arguments = [], Type $returnType = null, $static = false, Description $description = null ) { Assert::stringNotEmpty($methodName); Assert::boolean($static); if ($returnType === null) { $returnType = new Void_(); } $this->methodName = $methodName; $this->arguments = $this->filterArguments($arguments); $this->returnType = $returnType; $this->isStatic = $static; $this->description = $description; } public static function create( $body, TypeResolver $typeResolver = null, DescriptionFactory $descriptionFactory = null, TypeContext $context = null ) { Assert::stringNotEmpty($body); Assert::allNotNull([ $typeResolver, $descriptionFactory ]); if (!preg_match( '/^
                # Static keyword
                # Declares a static method ONLY if type is also present
                (?:
                    (static)
                    \s+
                )?
                # Return type
                (?:
                    (   
                        (?:[\w\|_\\\\]*\$this[\w\|_\\\\]*)
                        |
                        (?:
                            (?:[\w\|_\\\\]+)
                            # array notation           
                            (?:\[\])*
                        )*
                    )
                    \s+
                )?
                # Legacy method name (not captured)
                (?:
                    [\w_]+\(\)\s+
                )?
                # Method name
                ([\w\|_\\\\]+)
                # Arguments
                (?:
                    \(([^\)]*)\)
                )?
                \s*
                # Description
                (.*)
            $/sux', $body, $matches )) { return null; } list(, $static, $returnType, $methodName, $arguments, $description) = $matches; $static = $static === 'static'; if ($returnType === '') { $returnType = 'void'; } $returnType = $typeResolver->resolve($returnType, $context); $description = $descriptionFactory->create($description, $context); if (is_string($arguments) && strlen($arguments) > 0) { $arguments = explode(',', $arguments); foreach($arguments as &$argument) { $argument = explode(' ', self::stripRestArg(trim($argument)), 2); if ($argument[0][0] === '$') { $argumentName = substr($argument[0], 1); $argumentType = new Void_(); } else { $argumentType = $typeResolver->resolve($argument[0], $context); $argumentName = ''; if (isset($argument[1])) { $argument[1] = self::stripRestArg($argument[1]); $argumentName = substr($argument[1], 1); } } $argument = [ 'name' => $argumentName, 'type' => $argumentType]; } } else { $arguments = []; } return new static($methodName, $arguments, $returnType, $static, $description); } public function getMethodName() { return $this->methodName; } public function getArguments() { return $this->arguments; } public function isStatic() { return $this->isStatic; } public function getReturnType() { return $this->returnType; } public function __toString() { $arguments = []; foreach ($this->arguments as $argument) { $arguments[] = $argument['type'] . ' $' . $argument['name']; } return trim(($this->isStatic() ? 'static ' : '') . (string)$this->returnType . ' ' . $this->methodName . '(' . implode(', ', $arguments) . ')' . ($this->description ? ' ' . $this->description->render() : '')); } private function filterArguments($arguments) { foreach ($arguments as &$argument) { if (is_string($argument)) { $argument = [ 'name' => $argument ]; } if (! isset($argument['type'])) { $argument['type'] = new Void_(); } $keys = array_keys($argument); if ($keys !== [ 'name', 'type' ]) { throw new \InvalidArgumentException( 'Arguments can only have the "name" and "type" fields, found: ' . var_export($keys, true) ); } } return $arguments; } private static function stripRestArg($argument) { if (strpos($argument, '...') === 0) { $argument = trim(substr($argument, 3)); } return $argument; } } 