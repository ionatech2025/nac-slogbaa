package com.nac.slogbaa.iam.architecture;

import com.tngtech.archunit.core.domain.JavaClasses;
import com.tngtech.archunit.core.importer.ClassFileImporter;
import com.tngtech.archunit.core.importer.ImportOption;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;

/**
 * ArchUnit tests enforcing hexagonal architecture boundaries in the IAM module.
 * <ul>
 *   <li>Core (domain) must not depend on adapters or Spring</li>
 *   <li>Application layer may depend on core but not on adapters</li>
 *   <li>Adapters may depend on application + core but not on each other</li>
 * </ul>
 */
class HexagonalArchitectureTest {

    private static JavaClasses iamClasses;

    @BeforeAll
    static void importClasses() {
        iamClasses = new ClassFileImporter()
                .withImportOption(ImportOption.Predefined.DO_NOT_INCLUDE_TESTS)
                .importPackages("com.nac.slogbaa.iam");
    }

    @Test
    void coreShouldNotDependOnAdapters() {
        noClasses()
                .that().resideInAPackage("..core..")
                .should().dependOnClassesThat().resideInAPackage("..adapters..")
                .as("Core domain must not depend on adapters")
                .check(iamClasses);
    }

    @Test
    void coreShouldNotDependOnSpring() {
        noClasses()
                .that().resideInAPackage("..core..")
                .should().dependOnClassesThat().resideInAPackage("org.springframework..")
                .as("Core domain must not depend on Spring Framework")
                .check(iamClasses);
    }

    @Test
    void coreShouldNotDependOnApplication() {
        noClasses()
                .that().resideInAPackage("..core..")
                .should().dependOnClassesThat().resideInAPackage("..application..")
                .as("Core domain must not depend on application layer")
                .check(iamClasses);
    }

    @Test
    void applicationShouldNotDependOnAdapters() {
        noClasses()
                .that().resideInAPackage("..application..")
                .should().dependOnClassesThat().resideInAPackage("..adapters..")
                .as("Application layer must not depend on adapters")
                .check(iamClasses);
    }

    @Test
    void portInterfacesShouldBeInterfaces() {
        classes()
                .that().resideInAPackage("..application.port..")
                .should().beInterfaces()
                .as("Port types must be interfaces")
                .check(iamClasses);
    }
}
